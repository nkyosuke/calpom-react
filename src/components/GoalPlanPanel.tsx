import React, { useState, useEffect } from 'react';

type Props = {
  /* パネルの開閉 */
  isOpen: boolean;
  onClose: () => void;

  /* 保存ボタン → GPT 呼び出しへ渡す */
  onGenerate: (input: {
    goal: string;
    deadline: string;
    roughTasks: string;
  }) => void;

  /* すでに計画があるかどうか（警告表示用） */
  hasExistingPlan: boolean;
};

const GoalPlanPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  onGenerate,
  hasExistingPlan,
}) => {
  /* フォーム state */
  const [goal, setGoal]           = useState('');
  const [deadline, setDeadline]   = useState('');
  const [roughTasks, setTasks]    = useState('');

  /* 開くたびにリセット */
  useEffect(() => {
    if (isOpen) {
      setGoal('');
      setDeadline('');
      setTasks('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      {/* side‑panel (mobile: フル, PC: 右側) */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">🎯 新しい目標を設定</h2>

        {/* 目標 */}
        <label className="block text-sm mb-1">目標（例：TOEIC 800点）</label>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="あなたのゴール"
          className="border p-2 w-full mb-4 bg-gray-100 dark:bg-gray-800 rounded"
        />

        {/* 締切 */}
        <label className="block text-sm mb-1">締切日</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border p-2 w-full mb-4 bg-gray-100 dark:bg-gray-800 rounded"
        />

        {/* 粗タスク */}
        <label className="block text-sm mb-1">
          すでに考えているタスクや教材 <span className="text-gray-400">(任意)</span>
        </label>
        <textarea
          value={roughTasks}
          onChange={(e) => setTasks(e.target.value)}
          rows={4}
          placeholder="例：公式問題集 5 周 / 単語帳 1 日 30 語 …"
          className="border p-2 w-full mb-6 bg-gray-100 dark:bg-gray-800 rounded resize-none"
        />

        {/* ⚠️ 既存計画への警告 */}
        {hasExistingPlan && (
          <p className="text-red-600 text-sm mb-4">
            ⚠️ 既存の学習計画は上書きされ、元に戻せません。
          </p>
        )}

        {/* 生成ボタン */}
        <button
          onClick={() => onGenerate({ goal, deadline, roughTasks })}
          disabled={goal.trim() === '' || deadline === ''}
          className={`w-full py-2 rounded ${
            goal.trim() && deadline
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          広告を見て計画を生成する
        </button>

        {/* 閉じる */}
        <button
          onClick={onClose}
          className="mt-3 w-full py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          キャンセル
        </button>
      </div>
    </>
  );
};

export default GoalPlanPanel;
