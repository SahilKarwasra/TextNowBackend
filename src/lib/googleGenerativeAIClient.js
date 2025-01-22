import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getGeminiAIResponse(userMessage) {
  try {
    const result = await model.generateContent(userMessage);

    if (typeof result.response.text === "function") {
      const responseText = result.response.text();
      return responseText.trim();
    } else {
      throw new Error("Unexpected response structure from Google Generative AI");
    }
  } catch (error) {
    console.error("Error interacting with Google Generative AI:", error);
    throw new Error("Failed to generate response.");
  }
}
