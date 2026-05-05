import React from 'react';

export const PlayerInfo = ({ players, currentTurn, currentPlayerId }) => {
  if (!players || players.length === 0) return null;

  return (
    <div className="flex gap-8 justify-center mb-8">
      {players.map((player) => {
        const isCurrentTurn = player.socketId === currentTurn;
        const isCurrentPlayer = player.socketId === currentPlayerId;

        return (
          <div
            key={player.socketId}
            className={`
              card p-4 min-w-max
              ${isCurrentTurn ? 'ring-2 ring-yellow-400 shadow-lg' : ''}
              ${isCurrentPlayer ? 'ring-2 ring-green-400' : ''}
            `}
          >
            <div className="text-sm text-gray-600">
              {player.name}
            </div>
            <div className="text-3xl font-bold mt-2">
              {player.symbol}
            </div>
            <div className="mt-4 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Lives:</span>
                <span className="font-semibold">❤️ {player.lives}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Score:</span>
                <span className="font-semibold">⭐ {player.score}</span>
              </div>
            </div>
            {isCurrentTurn && (
              <div className="mt-2 text-yellow-500 font-semibold animate-pulse">
                Your Turn! 🎮
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerInfo;
