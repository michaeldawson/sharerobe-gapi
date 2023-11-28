import { google } from "googleapis";
const oauth2Client = new google.auth.OAuth2();

// Create the Gmail API client
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

export async function getGmailMessages(credentials: {
  id_token: string;
  access_token: string;
}) {
  oauth2Client.setCredentials(credentials);

  // Fetch messages that match an "order confirm" subject query
  const { data } = await gmail.users.messages.list({
    userId: "me",
    q: "subject: order confirm",
    maxResults: 500,
  });

  return data;
}
