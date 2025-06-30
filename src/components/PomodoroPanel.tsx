import React, { useState, useEffect } from 'react';

/* ---------- 型定義 ---------- */
export type PomodoroTask = {
  id: string;
  task: string;
  note: string;
  sets: number;
  start: string; // ISO
};

type PomodoroInput = {
  task: string;
  note: string;
  sets: number;
  eventId: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (input: PomodoroInput) => void;
  eventId: string | null;
  eventTitle: string | null;
  tasks: PomodoroTask[];
}

/* ---------- 定数 ---------- */
const DURATIONS = {
  focus: 25 * 60,
  break: 5 * 60,
  long: 15 * 60,
} as const;

/** タイマーのモード */
export type TimeMode = keyof typeof DURATIONS; // 'focus' | 'break' | 'long'

/* ------------------------------------------------------------------ */
const PomodoroPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  onRegister,
  eventId,
  eventTitle,
  tasks,
}) => {
  /* ---------- 入力値 ---------- */
  const [task, setTask]     = useState('');
  const [note, setNote]     = useState('');
  const [sets, setSets]     = useState(1);

  /* ---------- タイマー ---------- */
  const [mode, setMode]         = useState<TimeMode>('focus');
  const [secondsLeft, setLeft]  = useState<number>(DURATIONS.focus);
  const [running, setRunning]   = useState(false);

  /* ---------- イベントタイトルを自動入力 ---------- */
  useEffect(() => {
    if (eventTitle) setTask(eventTitle);
  }, [eventTitle]);

  /* ---------- モード切り替え時にリセット ---------- */
  useEffect(() => {
    setLeft(DURATIONS[mode]);
    setRunning(false);
  }, [mode]);

  /* ---------- カウントダウン ---------- */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  /* ---------- ハンドラ ---------- */
  const disabled = !eventId || task.trim() === '';

  const handleSave = () => {
    if (!eventId) return;
    onRegister({ eventId, task, note, sets });
    onClose();
  };

  const fmt = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  /* ---------- 表示制御 ---------- */
  if (!isOpen) return null;

  /* ---------- JSX ---------- */
  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 text-white shadow-xl z-50 flex flex-col">
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Pomodoro</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* タスク入力 */}
        <input
          className="w-full px-3 py-2 rounded bg-gray-800 placeholder-gray-400 focus:outline-none"
          placeholder="タスク名"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          readOnly={!!eventTitle}
        />
        {/* 備考 */}
        <textarea
          className="w-full px-3 py-2 h-20 rounded bg-gray-800 placeholder-gray-400 focus:outline-none"
          placeholder="備考"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* セット数 */}
        <div className="flex items-center space-x-2">
          <span>セット数:</span>
          <button
            onClick={() => setSets((s) => Math.max(1, s - 1))}
            className="px-2 py-1 bg-gray-700 rounded"
          >－</button>
          <span>{sets}</span>
          <button
            onClick={() => setSets((s) => Math.min(8, s + 1))}
            className="px-2 py-1 bg-gray-700 rounded"
          >＋</button>
        </div>

        {/* モード選択ボタン */}
        <div className="flex justify-center space-x-2">
          {(['focus', 'break', 'long'] as TimeMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded ${mode === m ? 'bg-cyan-600' : 'bg-gray-700'}`}
            >
              {m === 'focus' ? '25分' : m === 'break' ? '5分' : '15分'}
            </button>
          ))}
        </div>

        {/* タイマー表示 */}
        <div className="text-center text-4xl font-mono py-2">
          {fmt(secondsLeft)}
        </div>

        {/* スタート / ストップ */}
        <div className="flex space-x-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex-1 py-2 bg-cyan-600 rounded hover:bg-cyan-700"
          >
            {running ? 'ストップ' : 'スタート'}
          </button>
        </div>

        {/* 登録 */}
        <button
          onClick={handleSave}
          disabled={disabled}
          className={`w-full py-2 rounded ${disabled ? 'bg-gray-300' : 'bg-red-500 text-white'}`}
        >
          登録
        </button>

        {/* 本日の実績 */}
        {tasks && (
          <div className="mt-4">
            <h3 className="text-sm text-gray-400">本日の実績</h3>
            <ul className="text-xs max-h-40 overflow-y-auto space-y-1">
              {tasks.length === 0 && (
                <li className="text-gray-400">実績はまだありません</li>
              )}
              {tasks.map((r) => (
                <li key={r.id} className="text-gray-200 border-b border-gray-700 pb-1">
                  ✅ {r.task}（{r.sets}セット）<br />
                  🕒 {new Date(r.start).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroPanel;
