import React from 'react';
import Cell from './Cell';

export const Board = ({ board, onCellClick, disabled }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="board-grid" style={{ width: 'min(100%, 28rem)' }}>
        {board.map((value, index) => (
          <Cell
            key={index}
            position={index}
            value={value}
            onClick={onCellClick}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
