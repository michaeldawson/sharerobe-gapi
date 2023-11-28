import * as functions from "firebase-functions";

import admin, { firestore } from "../utils/admin";
import { getGmailMessages } from "./getGmailMessages";

export const afterProfileWrite = functions
  .runWith({ memory: "512MB" })
  .firestore.document("/profiles/{id}")
  .onWrite(async (change, { params: { id } }) => {
    // Now, fetch the last 100 emails that match the search query "order"
    const profile = change.after.data();

    if (!profile) return; // We're deleting, bail out

    const credentials = {
      id_token: profile.idToken,
      access_token: profile.accessToken,
    };

    const { messages } = await getGmailMessages(credentials);

    // Now, create a message document for each message in the list
    const batch = firestore.batch();

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    messages!.forEach((message) => {
      batch.set(
        firestore.doc(`messages/${message.id}`),
        {
          uid: profile.uid,
          createdAt: timestamp,
          updatedAt: timestamp,
          message,
          credentials,
        },
        { merge: true }
      );
    });

    return batch.commit();
  });
