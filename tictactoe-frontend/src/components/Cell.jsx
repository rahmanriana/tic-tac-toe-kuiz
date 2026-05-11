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
      className={`board-cell ${value ? getSymbolColor(value) : ''} ${disabled || value !== null ? 'disabled' : ''}`}
      style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
    >
      {value}
    </button>
  );
};

export default Cell;
