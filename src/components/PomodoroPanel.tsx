import React, { useState, useEffect } from 'react';

/* ---------- 型定義 ---------- */
export type PomodoroTask = {
  id: string;
  task: string;
  note: string;
  sets: number;
  start: string; // ISO
  eventId: string;
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
  /** 1セットずつ新規登録 */
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

/* ---------- beep音を鳴らす関数 ---------- */
const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
    osc.onended = () => ctx.close();
  } catch {/* noop */}
};

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
  const [task, setTask] = useState('');
  const [note, setNote] = useState('');
  const [setNumber, setSetNumber] = useState(1); // 何セット目かを表示

  /* ---------- タイマー ---------- */
  const [mode, setMode] = useState<TimeMode>('focus');
  const [secondsLeft, setLeft] = useState<number>(DURATIONS.focus);
  const [running, setRunning] = useState(false);

  /* ---------- イベントタイトルを自動入力 ---------- */
  useEffect(() => {
    if (eventTitle) setTask(eventTitle);
  }, [eventTitle]);

  /* ---------- セット数をイベント実績に応じて自動決定 ---------- */
  useEffect(() => {
    if (!eventId) {
      setSetNumber(1);
      return;
    }
    const already = tasks.filter((t) => t.eventId === eventId).length;
    setSetNumber(already + 1);
  }, [eventId, tasks]);

  /* ---------- モード切替時はリセット ---------- */
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
          playBeep();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  /* ---------- 実績登録 ---------- */
  const isFocus = mode === 'focus';
  const disabled = !eventId || task.trim() === '' || !isFocus;

  const handleSave = () => {
    if (!eventId) return;
    onRegister({ eventId, task, note, sets: 1 }); // 常に1セット登録
    onClose();
  };

  const fmt = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  if (!isOpen) return null;

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

        {/* 何セット目か表示 */}
        <div className="text-center text-sm text-gray-300">
          現在 <span className="font-bold text-white">{setNumber}</span> セット目
        </div>

        {/* モード選択 */}
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
        <div className="text-center text-4xl font-mono py-2">{fmt(secondsLeft)}</div>

        {/* スタート / ストップ */}
        <div className="flex space-x-2">
          <button onClick={() => setRunning((r) => !r)} className="flex-1 py-2 bg-cyan-600 rounded hover:bg-cyan-700">
            {running ? 'ストップ' : 'スタート'}
          </button>
        </div>

        {/* 登録 */}
        <button
          onClick={handleSave}
          disabled={disabled}
          className={`w-full py-2 rounded ${disabled ? 'bg-gray-300' : 'bg-red-500 text-white'}`}
        >
          {setNumber}セット目を登録
        </button>

        {/* 本日の実績 */}
        {tasks && (
          <div className="mt-4">
            <h3 className="text-sm text-gray-400">本日の実績</h3>
            <ul className="text-xs max-h-40 overflow-y-auto space-y-1">
              {tasks.length === 0 && <li className="text-gray-400">実績はまだありません</li>}
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
