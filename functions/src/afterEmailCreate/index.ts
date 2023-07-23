import * as functions from "firebase-functions";

export const afterEmailCreate = functions
  .runWith({ memory: "512MB" })
  .firestore.document("/gameplans/{id}")
  .onWrite(async (change, { params: { id } }) => {
    // Take the body of the email, send it to the chatGPT API, and ask chat GPT to extract product
    // details and give them to us in object form. Then, parse the response, and create a
    // corresponding product.
  });
