import * as functions from "firebase-functions";

("use strict");

import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2();

export const afterProfileWrite = functions
  .runWith({ memory: "512MB" })
  .firestore.document("/profiles/{id}")
  .onWrite(async (change, { params: { id } }) => {
    // Now, fetch the last 100 emails that match the search query "order"
    const profile = change.after.data();

    if (!profile) return; // We're deleting, bail out

    // Set the access token
    oauth2Client.setCredentials({
      access_token: profile.accessToken,
    });

    // Create the Gmail API client
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    google.options({ auth: profile.accessToken });

    const messages = await gmail.users.messages.list({
      userId: "me",
      q: "subject: order",
      maxResults: 100,
    });

    console.log({ messages });
  });
