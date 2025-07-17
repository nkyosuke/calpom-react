import { GoogleGenerativeAI } from "@google/generative-ai";

// .env からAPIキーを取得（Create React App形式）
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing Gemini API key in .env");

const ai = new GoogleGenerativeAI(apiKey);

export async function generatePlan(prompt: string): Promise<string> {
  const model = ai.getGenerativeModel({ model: "models/gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
