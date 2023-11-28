import * as functions from "firebase-functions";
import { google } from "googleapis";
import { sendChatMessage } from "../utils/chatGpt";

const oauth2Client = new google.auth.OAuth2();

export const afterMessageCreate = functions
  .runWith({ memory: "512MB" })
  .firestore.document("/messages/{id}")
  .onCreate(async (snap) => {
    // Fetch the last 100 emails that match the search query "order"
    const message = snap.data();

    if (!message) return; // We're deleting, bail out

    oauth2Client.setCredentials(message.credentials);

    // Create the Gmail API client
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const { data } = await gmail.users.messages.get({
      userId: "me",
      id: message.message.id,
    });

    let fullBody = data.payload!.body!.data! || "";
    data.payload!.parts?.forEach(
      (part) => (fullBody = fullBody.concat(part.body!.data!))
    );
    const buffer = Buffer.from(fullBody, "base64");
    const body = buffer.toString("utf-8");

    snap.ref.update({
      body,
    });

    // Now, ask ChatGPT if it thinks this email is an order confirmation email
    const { choices } = await sendChatMessage(body, [assessmentMessage]);

    await snap.ref.update({
      assessmentResponse: choices[0],
    });

    const assessment = JSON.parse(choices[0].message.content);

    if (assessment) {
      // If it is, ask ChatGPT to extract the item details
      const { choices } = await sendChatMessage(body, [extractionMessage]);
      await snap.ref.update({
        itemsResponse: choices[0],
      });
      const { items } = JSON.parse(choices[0].message.content);
      return snap.ref.update({
        raw: data,
        body,
        isFashionPurchase: true,
        items,
      });
    } else {
      return snap.ref.update({ isFashionPurchase: false });
    }
  });

const assessmentMessage = {
  role: "system",
  content: `You will be given an email. Please determine if it confirms purchase of a "fashion-related" item.

  Return true if the purchase appears to contain "fashion" items, such as a handbag, dress, shoes, pants.

  Return false if the purchase appears to not contain a fashion item
  Return false if it only contains non-fashion items, such as electronics, food, supplements or medicine, posters, sporting goods that are not wearable as fashion items, cryptocurrency purchases, etc.

  If the email content appears to be empty or malformed, please return false

  Your response should not include any additional words, but should be either:

  true

  or

  false
  `,
};

const extractionMessage = {
  role: "system",
  content: `
  Please try to extract data from the following email, which we believe is a confirmation of one or more fashion items that were purchased. The JSON object should follow this schema:
    {
      "items": [
        {
          "name": "",
          "brand: "",
          "imageUrl": "",
          "price": {
            "cents": 0,
            "currency": "USD"
          }
        }
      ]
    }

    Please provide data for each of the properties above, as follows:

    name: the name of the item purchased
    brand: the brand of the item purchased
    imageUrl: A URL to an image of the item purchased. This may be present in the email content inside an <img/> HTML tag. If you can't find such an image tag for the item, set this property to a blank string.
    price: The price of the item, including its currency.

    If for some reason you can't find any item details, please respond with:

    {
      "items": []
    }

    My next message will be the HTML content of the email.
  `,
};
