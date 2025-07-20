import React from "react";
import { GeminiPlan, GenerateInput } from "../lib/generatePlanWithGemini";

interface GeminiPlanPreviewPanelProps {
  input: GenerateInput;
  plan: GeminiPlan;
  onSave: () => void;
  onBack?: () => void;
}

export const GeminiPlanPreviewPanel: React.FC<GeminiPlanPreviewPanelProps> = ({
  input,
  plan,
  onSave,
  onBack,
}) => {
  return (
    <div className="p-4 border rounded shadow bg-white max-h-[70vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-2">学習計画プレビュー</h2>

      <div className="mb-4">
        <p><strong>目標:</strong> {input.goal}</p>
        <p><strong>締切:</strong> {input.deadline}</p>
        <p><strong>参考タスク:</strong> {input.roughTasks}</p>
      </div>

      <h3 className="font-semibold mb-1">マイルストーン</h3>
      <ul className="list-disc list-inside mb-4">
        {plan.milestones.map((m, idx) => (
          <li key={idx}>{m}</li>
        ))}
      </ul>

      <h3 className="font-semibold mb-1">日ごとのスケジュール</h3>
      <ul className="space-y-2">
        {plan.schedule.map((day, i) => (
          <li key={i} className="border rounded p-2">
            <strong>{day.date}</strong>
            <ul className="ml-4 list-disc list-inside">
              {day.tasks.map((task, j) => (
                <li key={j}>{task.title}（{task.duration}分）</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end space-x-3">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            戻る
          </button>
        )}
        <button
          onClick={onSave}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          保存する
        </button>
      </div>
    </div>
  );
};
