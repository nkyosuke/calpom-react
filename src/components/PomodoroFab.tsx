import React from 'react';

type Props = { onClick: () => void; disabled?: boolean };

const PomodoroFab: React.FC<Props> = ({ onClick, disabled }) => (
  <button
    onClick={disabled ? undefined : onClick}
    className={
      "fixed bottom-6 right-6 rounded-full p-4 shadow-lg transition " +
      (disabled
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-red-500 hover:bg-red-600 text-white")
    }
  >
    🍅
  </button>
);

export default PomodoroFab;