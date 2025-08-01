import React, { useState } from "react";
import { GeminiPlan, GenerateInput } from "../lib/generatePlanWithGemini";

interface GeminiPlanPreviewPanelProps {
  input: GenerateInput;
  plan: GeminiPlan;
  onSave: (plan: GeminiPlan) => void;
  onBack?: () => void;
  uid: string;
}

const applyCustomTimesToSchedule = (
  plan: GeminiPlan,
  weekdayTime: string,
  holidayTime: string
): GeminiPlan => {
  const updatedSchedule = plan.schedule.map((day) => {
    const date = day.date;
    const dayOfWeek = new Date(date).getDay(); // 0 = 日曜, 6 = 土曜

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const time = isWeekend ? holidayTime : weekdayTime;

    return {
      ...day,
      startTime: time,
      start: `${date}T${time}`, // ← FullCalendar 用にも使える
    };
  });

  return {
    ...plan,
    schedule: updatedSchedule,
  };
};

export const GeminiPlanPreviewPanel: React.FC<GeminiPlanPreviewPanelProps> = ({
  input,
  plan,
  onSave,
  onBack,
  uid,
}) => {
  const [weekdayTime, setWeekdayTime] = useState("20:00");
  const [holidayTime, setHolidayTime] = useState("10:00");
  console.log("📦 受け取ったplan:", plan); // ← ここ

  if (!plan || !plan.schedule) {
    return <div>プラン作成中...</div>; // safety fallback
  }
  return (
    /*<div className="p-4 border rounded shadow bg-white max-h-[70vh] overflow-y-auto">*/
    /*<div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
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

      <div className="flex flex-col gap-4">
        <div>
          <label>平日の開始時間</label>
          <input
            type="time"
            value={weekdayTime}
            onChange={(e) => setWeekdayTime(e.target.value)}
          />
        </div>
        <div>
          <label>休日の開始時間</label>
          <input
            type="time"
            value={holidayTime}
            onChange={(e) => setHolidayTime(e.target.value)}
          />
        </div>
      </div>

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
          onClick={() => {
            const updatedPlan = applyCustomTimesToSchedule(
              plan,
              weekdayTime,
              holidayTime
            );
            onSave(updatedPlan);
          }}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          保存する
        </button>
      </div>*/
    <div className="bg-blue-50 min-h-screen py-10 flex justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          📘 学習計画プレビュー
        </h2>

        <div className="mb-6 bg-blue-100 rounded-lg p-4">
          <p>
            <strong>🎯 目標:</strong> {input.goal}
          </p>
          <p>
            <strong>📅 締切:</strong> {input.deadline}
          </p>
          <p>
            <strong>📝 参考タスク:</strong> {input.roughTasks}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-medium text-blue-700 mb-1">
              平日の開始時間
            </label>
            <input
              type="time"
              value={weekdayTime}
              onChange={(e) => setWeekdayTime(e.target.value)}
              className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block font-medium text-blue-700 mb-1">
              休日の開始時間
            </label>
            <input
              type="time"
              value={holidayTime}
              onChange={(e) => setHolidayTime(e.target.value)}
              className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          📆 日ごとのスケジュール
        </h3>
        <ul className="space-y-4">
          {plan.schedule.map((day, i) => (
            <li key={i}>
              <div className="text-md font-semibold text-blue-600 mb-1">
                {day.date}
              </div>
              <ul className="space-y-3">
                {day.tasks.map((task, j) => (
                  <li
                    key={j}
                    className="rounded-lg border border-blue-100 bg-blue-50 p-3 shadow-sm"
                  >
                    <div className="font-medium text-gray-800">
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      ⏱ {task.minutes ?? 0}分
                    </div>
                    {task.note && (
                      <div className="text-sm text-gray-600 mt-2 border-t pt-2 border-blue-200">
                        {task.note}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-end space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              戻る
            </button>
          )}
          <button
            onClick={() => {
              const updatedPlan = applyCustomTimesToSchedule(
                plan,
                weekdayTime,
                holidayTime
              );
              onSave(updatedPlan);
            }}
            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
};
