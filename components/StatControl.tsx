
import React from 'react';

interface StatControlProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  colorClass?: string;
}

const StatControl: React.FC<StatControlProps> = ({
  label,
  value,
  onIncrement,
  onDecrement,
  colorClass = "bg-slate-700"
}) => {
  return (
    <div className="flex flex-col items-center p-2 rounded-lg bg-slate-800/50 border border-slate-700 min-w-[90px]">
      <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 hover:bg-red-900/50 transition-colors text-slate-300 active:scale-95"
          aria-label="Decrease"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        <span className="text-sm font-bold w-5 text-center">{value}</span>
        <button
          onClick={onIncrement}
          className={`w-6 h-6 flex items-center justify-center rounded-full ${colorClass} hover:opacity-80 transition-opacity text-white active:scale-95`}
          aria-label="Increase"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StatControl;
