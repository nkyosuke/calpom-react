import React, { useState, useEffect } from "react";
import { format } from "date-fns";

type GenerateInput = {
  goal: string;
  deadline: string;
  roughTasks: string;
  weekdayHours: number;
  weekendHours: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  hasExistingPlan: boolean;
  onNext: (input: GenerateInput) => void;
};

const GoalPlanPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  hasExistingPlan,
  onNext,
}) => {
  /* ---------- form state ---------- */
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [weekdayHours, setWeekdayHours] = useState(1);
  const [weekendHours, setWeekendHours] = useState(2);
  const [errorMessage, setError] = useState("");
  const [showAdReward, setShowAdReward] = useState(false);
  const [showPlanPreview, setShowPlanPreview] = useState(false);

  /* ---------- util ---------- */
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 3);

  /* ---------- validation ---------- */
  const validate = () => {
    if (!goal.trim()) return "目標を入力してください。";
    if (!deadline) return "締切日を選択してください。";

    const d = new Date(deadline);
    if (d < today) return "締切日は今日以降にしてください。";
    if (d > maxDate) return "締切日は最大3ヶ月以内に設定してください。";

    if (weekdayHours <= 0)
      return "平日の学習時間を1時間以上で設定してください。";
    if (weekendHours <= 0)
      return "土日の学習時間を1時間以上で設定してください。";
    return "";
  };

  /* ---------- panel open → フォームリセット ---------- */
  useEffect(() => {
    if (isOpen) {
      setGoal("");
      setDeadline("");
      setWeekdayHours(1);
      setWeekendHours(2);
      setNotes("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* ---------- UI ---------- */
  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* side panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
        {!showAdReward && !showPlanPreview && (
          <>
            <h2 className="text-xl font-bold mb-4">🎯 新しい目標を設定</h2>

            {/* 目標 */}
            <label className="block text-sm mb-1">
              目標（例：TOEIC 800点）
            </label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="border p-2 w-full mb-4 bg-gray-100 dark:bg-gray-800 rounded"
              placeholder="あなたのゴール"
            />

            {/* 締切 */}
            <label className="block text-sm mb-1">
              締切日 <span className="text-gray-400">(最大3ヶ月以内)</span>
            </label>
            <input
              type="date"
              value={deadline}
              max={format(maxDate, "yyyy-MM-dd")}
              onChange={(e) => setDeadline(e.target.value)}
              className="border p-2 w-full mb-4 bg-gray-100 dark:bg-gray-800 rounded"
            />

            {/* 平日学習時間 */}
            <label className="block text-sm mb-1">平日の学習時間 (時間)</label>
            <input
              type="number"
              min={1}
              value={weekdayHours}
              onChange={(e) => setWeekdayHours(Number(e.target.value))}
              className="border p-2 w-full mb-4 bg-gray-100 dark:bg-gray-800 rounded"
            />

            {/* 休日学習時間 */}
            <label className="block text-sm mb-1">土日の学習時間 (時間)</label>
            <input
              type="number"
              min={1}
              value={weekendHours}
              onChange={(e) => setWeekendHours(Number(e.target.value))}
              className="border p-2 w-full mb-4 bg-gray-100 dark:bg-gray-800 rounded"
            />

            {/* 任意メモ */}
            <label className="block text-sm mb-1">
              教材や補足情報 <span className="text-gray-400">(任意)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="例：公式問題集 / セキュリティが苦手 …"
              className="border p-2 w-full mb-6 bg-gray-100 dark:bg-gray-800 rounded resize-none"
            />

            {/* 警告やエラーメッセージ */}
            {hasExistingPlan && (
              <p className="text-red-600 text-sm mb-2">
                ⚠️ 既存の学習計画は上書きされ、元に戻せません。
              </p>
            )}
            {errorMessage && (
              <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
            )}

            {/* ボタン */}
            <button
              onClick={() => {
                const error = validate();
                if (error) {
                  setError(error);
                  return;
                }
                onNext({
                  goal,
                  deadline,
                  roughTasks: notes,
                  weekdayHours,
                  weekendHours,
                });
              }}
              disabled={!goal.trim() || !deadline}
              className={`w-full py-2 rounded ${
                goal.trim() && deadline
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              広告を見て学習計画を生成する
            </button>

            <button
              onClick={onClose}
              className="mt-3 w-full py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              キャンセル
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default GoalPlanPanel;
