import React from 'react';
import Cell from './Cell';

export const Board = ({ board, onCellClick, disabled }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-lg">
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
