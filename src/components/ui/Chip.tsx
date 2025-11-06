import React from 'react';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ label, active, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm transition-colors ${
        active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
      } ${className}`}
    >
      {label}
    </button>
  );
};

export default Chip;
