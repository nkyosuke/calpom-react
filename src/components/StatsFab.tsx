import { BarChart2 } from 'lucide-react';
import React from 'react';

type Props = {
  onClick: () => void;
};

const StatsFab: React.FC<Props> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-24 w-14 h-14 rounded-full bg-emerald-500 hover:opacity-90 shadow-lg flex items-center justify-center z-40"
  >
    <BarChart2 size={24} className="text-white" />
  </button>
);

export default StatsFab;