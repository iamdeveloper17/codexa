import { createOpenAI } from "@ai-sdk/openai";

// Gemini's OpenAI-compatible endpoint
export const gemini = createOpenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});