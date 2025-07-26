import React from "react";
import { GeminiPlan, GenerateInput } from "../lib/generatePlanWithGemini";

interface GeminiPlanPreviewPanelProps {
  input: GenerateInput;
  plan: GeminiPlan;
  onSave: (plan: GeminiPlan) => void;
  onBack?: () => void;
  uid: string;
}

export const GeminiPlanPreviewPanel: React.FC<GeminiPlanPreviewPanelProps> = ({
  input,
  plan,
  onSave,
  onBack,
  uid,
}) => {
  console.log("📦 受け取ったplan:", plan); // ← ここ

  if (!plan || !plan.schedule) {
    return <div>プラン作成中...</div>; // safety fallback
  }
  return (
    /*<div className="p-4 border rounded shadow bg-white max-h-[70vh] overflow-y-auto">*/
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-2">学習計画プレビュー</h2>

      <div className="mb-4">
        <p>
          <strong>目標:</strong> {input.goal}
        </p>
        <p>
          <strong>締切:</strong> {input.deadline}
        </p>
        <p>
          <strong>参考タスク:</strong> {input.roughTasks}
        </p>
      </div>

      <h3 className="font-semibold mb-1">マイルストーン</h3>
      <ul className="space-y-2 mb-4">
        {plan.milestones.map((m, idx) => (
          <li key={idx} className="border rounded p-2">
            <div className="text-sm text-gray-500">{m.date}</div>
            <div className="font-semibold">{m.title}</div>
            <div className="text-sm text-gray-600">評価基準: {m.criteria}</div>
          </li>
        ))}
      </ul>

      <h3 className="font-semibold mb-1">日ごとのスケジュール</h3>
      <ul className="space-y-6">
        {plan.schedule.map((day, i) => (
          <li key={i}>
            <div className="text-lg font-semibold mb-2 text-blue-700">
              {day.date}
            </div>
            <ul className="space-y-3">
              {day.tasks.map((task, j) => (
                <li
                  key={j}
                  className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-4 shadow-sm"
                >
                  <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {task.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ⏱ {task.minutes ?? 0}分
                  </div>
                  {task.note && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 border-t border-gray-200 dark:border-zinc-700 pt-2">
                      {task.note}
                    </div>
                  )}
                </li>
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
          onClick={() => onSave(plan)}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          保存する
        </button>
      </div>
    </div>
  );
};
