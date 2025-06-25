import { Play } from 'lucide-react';            // npm i lucide-react
import React from 'react';

type Props = { onClick: () => void };

const PomodoroFab: React.FC<Props> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-lg transition"
    aria-label="Start Pomodoro"
  >
    <Play className="w-6 h-6" />
  </button>
);

export default PomodoroFab;