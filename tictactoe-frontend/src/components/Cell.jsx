import React from 'react';

export const Cell = ({ position, value, onClick, disabled }) => {
  const getSymbolColor = (symbol) => {
    if (symbol === 'X') return 'text-blue-600 font-bold text-3xl';
    if (symbol === 'O') return 'text-red-600 font-bold text-3xl';
    return '';
  };

  return (
    <button
      onClick={() => onClick(position)}
      disabled={disabled || value !== null}
      className={`
        w-32 h-32 border-2 border-gray-300 rounded-lg
        flex items-center justify-center text-4xl font-bold
        transition-all duration-200 cursor-pointer
        ${value ? getSymbolColor(value) : 'hover:bg-gray-100'}
        ${disabled || value !== null ? 'cursor-not-allowed opacity-75' : ''}
        bg-white
      `}
    >
      {value}
    </button>
  );
};

export default Cell;
