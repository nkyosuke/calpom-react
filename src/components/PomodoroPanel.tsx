import React, { useState, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: { task: string; note: string; sets: number }) => void;
};

const FOCUS_MIN = 25;
const BREAK_MIN = 5;

const PomodoroPanel: React.FC<Props> = ({ isOpen, onClose, onRegister }) => {
  const [task, setTask] = useState('');
  const [note, setNote] = useState('');
  const [sets, setSets] = useState(1);
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);

  // カウントダウン
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // フェーズ切替
          if (phase === 'focus') {
            setPhase('break');
            return BREAK_MIN * 60;
          } else {
            setPhase('focus');
            return FOCUS_MIN * 60;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, phase]);

  const fmt = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-gray-900 text-white shadow-xl z-40">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Pomodoro</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="p-4 space-y-4">
        <input
          className="w-full px-3 py-2 rounded bg-gray-800 placeholder-gray-400 focus:outline-none"
          placeholder="タスク名"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <textarea
          className="w-full px-3 py-2 h-20 rounded bg-gray-800 placeholder-gray-400 focus:outline-none"
          placeholder="備考"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* セット数カウンター */}
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

        {/* タイマー */}
        <div className="text-center text-4xl font-mono">
          {fmt(secondsLeft)}
        </div>
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
          onClick={() => {
            onRegister({ task, note, sets });
            onClose();
          }}
          className="w-full py-2 bg-green-600 rounded hover:bg-green-700 mt-4 disabled:opacity-40"
          disabled={!task.trim()}
        >
          実績を保存
        </button>
      </div>
    </div>
  );
};

export default PomodoroPanel;