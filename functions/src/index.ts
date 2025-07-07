import * as functions from "firebase-functions";
import fetch from "node-fetch";
// 環境変数からAPIキーを取得（セキュアに保ちたい場合）
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_FALLBACK_API_KEY";

/**
 * Geminiにプロンプトを送信して学習計画を生成するエンドポイント
 */
export const generateStudyPlan = functions.https.onCall(
  async (data, context) => {
    const { prompt } = data;

    if (!prompt || typeof prompt !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "プロンプトが不正です"
      );
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Gemini API エラー:", result);
        throw new functions.https.HttpsError("internal", "Gemini呼び出し失敗");
      }

      return result; // フロントに返却
    } catch (err) {
      console.error("fetch実行エラー:", err);
      throw new functions.https.HttpsError(
        "internal",
        "内部エラーが発生しました"
      );
    }
  }
);
