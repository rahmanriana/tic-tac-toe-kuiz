import React from 'react';

export const Cell = ({ position, value, onClick, disabled }) => {
  const getSymbolColor = (symbol) => {
    if (symbol === 'X') return 'text-blue-600';
    if (symbol === 'O') return 'text-red-600';
    return '';
  };

  return (
    <button
      onClick={() => onClick(position)}
      disabled={disabled || value !== null}
      style={{ aspectRatio: '1 / 1', fontSize: 'clamp(1.5rem, 9vw, 2.25rem)' }}
      className={`
        w-full border-2 border-gray-300 rounded-lg
        flex items-center justify-center font-bold
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
