import fetch from "cross-fetch";
import { defineString } from "firebase-functions/params";
import { logger } from "firebase-functions/v1";

const API_KEY = defineString("CHAT_GPT_API_KEY");
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function sendChatMessage(
  prompt: string,
  previousMessages: Array<{ role: string; content: string }>
) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY.value()}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [...previousMessages, { role: "user", content: prompt }],
    }),
  };

  try {
    const response = await fetch(API_ENDPOINT, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error fetching chat response:", error);
    return null;
  }
}
