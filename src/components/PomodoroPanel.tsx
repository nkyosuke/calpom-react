import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

type PomodoroInput = {
  task: string;
  note: string;
  sets: number;
  eventId: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (input: PomodoroInput) => void;
  eventId: string | null;
  eventTitle: string | null;
  tasks: PomodoroTask[];
};

const FOCUS_MIN = 25;
const BREAK_MIN = 5;

const PomodoroPanel: React.FC<Props> = ({ isOpen, onClose, onRegister, eventId ,eventTitle,tasks}) => {
  const [task, setTask] = useState('');
  const [note, setNote] = useState('');
  const [sets, setSets] = useState(1);
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);


  const disabled = !eventId || task.trim() === "";

  const handleSave = () => {
    if (!eventId) return;
    onRegister({ eventId, task, note, sets });
    onClose();
  };

  useEffect(() => {
    if (eventTitle) {
      setTask(eventTitle);
    }
  }, [eventTitle]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
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
          readOnly={!!eventTitle} // イベントタイトルがある場合は読み取り専用
        />
        <textarea
          className="w-full px-3 py-2 h-20 rounded bg-gray-800 placeholder-gray-400 focus:outline-none"
          placeholder="備考"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

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

        <button
          onClick={handleSave}
          disabled={disabled}
          className={`w-full py-2 rounded ${disabled ? "bg-gray-300" : "bg-red-500 text-white"}`}
        >
          登録
        </button>
      </div>
      {tasks && (
       <div className="mt-4">
          <h3 className="text-sm text-gray-400">本日の実績</h3>
          <ul className="text-xs max-h-40 overflow-y-auto">
            {tasks.length === 0 && <p className="text-xs text-gray-400">実績はまだありません</p>}
            {tasks.map((r) => (
              <div key={r.id} className="text-xs text-gray-200 border-b border-gray-700 py-1">
              ✅ {r.task}（{r.sets}セット）<br />
              🕒 {new Date(r.start).toLocaleTimeString()}
              </div>
           ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PomodoroPanel;
