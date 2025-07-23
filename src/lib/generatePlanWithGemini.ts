import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildGeminiPromptJSON } from "../utils/buildGeminiPrompt";

/* ---------- 型定義 ---------- */
export interface GenerateInput {
  goal: string;
  deadline: string;
  roughTasks: string;
  weekdayHours: number;
  weekendHours: number;
}

export interface GeminiTask {
  title: string;
  minutes: number;
  note: string;
}

export interface GeminiDay {
  date: string;
  tasks: GeminiTask[];
}

export interface GeminiMilestone {
  date: string;
  title: string;
  criteria: string;
}

export interface GeminiPlan {
  milestones: GeminiMilestone[];
  schedule: GeminiDay[];
}

function isGeminiPlan(obj: any): obj is GeminiPlan {
  return obj && Array.isArray(obj.milestones) && Array.isArray(obj.schedule);
}

/* ---------- メイン処理 ---------- */
/* ローカルと本番環境を切り替えて、API呼び出し処理を実行する*/
export async function generatePlanWithGemini(
  input: GenerateInput
): Promise<GeminiPlan> {
  const useFunctions = process.env.REACT_APP_USE_GEMINI_FUNCTION === "true";
  console.log("🔥 generateGeminiTextStream called with:", input);

  const plan = useFunctions
    ? await fetchFromFunctions(input)
    : await fetchFromClient(input);

  if (!isGeminiPlan(plan)) {
    throw new Error("Gemini レスポンスの形式が不正です");
  }

  return plan;
}

/* ---------- Firebase Functions 経由 ---------- */
async function fetchFromFunctions(input: GenerateInput): Promise<GeminiPlan> {
  const callable = httpsCallable(functions, "generateStudyPlan");
  const { data } = await callable(input);

  let plan: GeminiPlan | null = null;

  if (typeof data === "string") {
    try {
      plan = JSON.parse(data);
    } catch {
      throw new Error("AI から想定外の文字列が返されました");
    }
  } else {
    plan = data as GeminiPlan;
  }

  if (!isGeminiPlan(plan)) {
    throw new Error("AI レスポンスの形式が不正です");
  }

  return plan;
}

/* ---------- クライアントから直接Gemini API呼び出し ---------- */
/*async function fetchFromClient(input: GenerateInput): Promise<GeminiPlan> {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini APIキーが設定されていません");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = buildGeminiPromptJSON(input);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  console.log("📩 Geminiからの生レスポンス:", response);
  const text = response.text();

  try {
    const plan = JSON.parse(text);
    if (!isGeminiPlan(plan)) throw new Error();
    return plan;
  } catch {
    throw new Error("Gemini のレスポンスがパースできませんでした");
  }
}*/

/* ---------- クライアントから直接Gemini API呼び出し ---------- */
async function fetchFromClient(input: GenerateInput): Promise<GeminiPlan> {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini APIキーが設定されていません");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = buildGeminiPromptJSON(input);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  console.log("📩 Geminiからの生レスポンス:", response);

  const text = response.text();

  // JSON部分だけを抽出
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Gemini の応答に JSON が含まれていません");
  }
  const wrappedText = text.slice(jsonStart, jsonEnd + 1).trim();

  try {
    const plan = JSON.parse(wrappedText);
    if (!isGeminiPlan(plan)) throw new Error();
    return plan;
  } catch {
    throw new Error("Gemini のレスポンスがパースできませんでした");
  }
}
