import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { AdRewardPanel } from "./AdRewardPanel";
import { GeminiPlanPreviewPanel } from "./GeminiPlanPreviewPanel";

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
  onGenerate: (input: GenerateInput) => void;
  hasExistingPlan: boolean;
  isGenerating: boolean;
};

const GoalPlanPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  onGenerate,
  hasExistingPlan,
  isGenerating,
}) => {
  /* ---------- form state ---------- */
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [weekdayHours, setWeekdayHours] = useState(1);
  const [weekendHours, setWeekendHours] = useState(2);
  const [errorMessage, setError] = useState("");
  const [showAdReward, setShowAdReward] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [stage, setStage] = useState<"form" | "ad" | "preview">("form");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null); // Geminiの出力
  const [isLoading, setIsLoading] = useState(false);

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

  /*const handleGenerateClick = () => {
  //  const err = validate();
  //  if (err) {
      setError(err);
      return;
    }
    console.log("[Generate] input", input);
    setError("");
    onGenerate({
      goal,
      deadline,
      roughTasks: notes,
      weekdayHours,
      weekendHours,
    });
  };*/

  /*const handleGenerateClick = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setShowAdReward(true); // 広告パネルを表示
  };*/

  const handleGenerateClick = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStage("ad");
  };

  const handleRewardConfirmed = async () => {
    setIsLoading(true);
    try {
      const plan = await generatePlanWithGemini({
        goal,
        deadline,
        roughTasks: notes,
        weekdayHours,
        weekendHours,
      });
      setGeneratedPlan(plan);
      setStage("preview");
    } catch (e: any) {
      console.error("Gemini生成失敗", e);
      setError(e.message || "計画生成に失敗しました");
      setStage("form"); // 戻す
    } finally {
      setIsLoading(false);
    }
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
              onClick={handleGenerateClick}
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

        {/* 広告視聴パネル */}
        {showAdReward && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
              <AdRewardPanel
                onRewardConfirmed={() => {
                  setShowAdReward(false);
                  setAdWatched(true);
                  setShowPlanPreview(true); // ← 学習計画プレビューへ
                }}
              />
            </div>
          </div>
        )}

        {/* 学習計画プレビュー */}
        {showPlanPreview && (
          <GeminiPlanPreviewPanel
            input={{
              goal,
              deadline,
              roughTasks: notes,
              weekdayHours,
              weekendHours,
            }}
            onBack={() => setShowPlanPreview(false)}
            onComplete={() => {
              onClose();
            }}
          />
        )}
      </div>
    </>
  );
};

export default GoalPlanPanel;
