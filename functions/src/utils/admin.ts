import * as admin from "firebase-admin";

var serviceAccount = require("../../sharerobe-firebase-adminsdk.json");

export const appEnv = (serviceAccount.project_id as string).includes("test")
  ? "staging"
  : "production";

// if (process.env.NODE_ENV === "development") {
//   process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
//   console.log("Using emulator");
// }

admin.initializeApp({
  projectId: serviceAccount.project_id,
  credential: admin.credential.cert(serviceAccount),
});

export const projectId = serviceAccount.project_id;
export const firestore = admin.firestore();
firestore.settings({
  ignoreUndefinedProperties: true,
});

export const auth = admin.auth();
export default admin;
