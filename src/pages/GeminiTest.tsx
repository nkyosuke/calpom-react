import { useState } from "react";
import { generatePlan } from "../utils/geminiClient";

export default function GeminiTest() {
  const [prompt, setPrompt] = useState("TOEIC800点を3ヶ月で取得するにはどうしたらいい？");
  const [output, setOutput] = useState("");

  const handleRun = async () => {
    setOutput("実行中...");
    try {
      const result = await generatePlan(prompt);
      setOutput(result);
    } catch (e) {
      console.error(e);
      setOutput("エラーが発生しました");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>🎯 Gemini テスト</h1>
      <textarea
        rows={5}
        style={{ width: "100%", marginBottom: 12 }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleRun} style={{ marginBottom: 12 }}>
        実行する
      </button>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f8f8f8", padding: 12 }}>
        {output}
      </pre>
    </div>
  );
}
