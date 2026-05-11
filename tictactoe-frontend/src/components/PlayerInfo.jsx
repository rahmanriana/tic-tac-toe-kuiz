import React from 'react';

export const PlayerInfo = ({ players, currentTurn, currentPlayerId }) => {
  if (!players || players.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
      {players.map((player) => {
        const isCurrentTurn = player.socketId === currentTurn;
        const isCurrentPlayer = player.socketId === currentPlayerId;

        return (
          <div
            key={player.socketId}
            className={`p-4 rounded-xl border-2 transition-all md:min-w-fit md:flex-1 ${
              isCurrentTurn
                ? 'bg-cyan-400/20 border-cyan-400 shadow-lg shadow-cyan-400/50'
                : 'bg-white/8 border-white/20'
            }`}
          >
            {/* Player Info */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {player.name}
                </div>
                <div className="text-xl font-black text-white mt-1">{player.symbol}</div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="text-sm font-bold text-white">
                  ❤️ {player.lives}
                </div>
                <div className="text-xs text-slate-300">
                  ⭐ {player.score}
                </div>
              </div>
            </div>

            {/* Turn Indicator */}
            {isCurrentTurn && (
              <div className="mt-3 text-xs font-bold text-cyan-300 animate-pulse text-center border-t border-cyan-400/50 pt-2">
                → Your Turn!
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PlayerInfo;
