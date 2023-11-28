import * as repl from "repl";
import admin, { appEnv, firestore } from "./src/utils/admin";
const { google } = require("googleapis");

const replServer = repl.start({
  prompt: `firebase(${appEnv}) > `,
});

replServer.context.firestore = firestore;
replServer.context.admin = admin;
replServer.context.google = google;
