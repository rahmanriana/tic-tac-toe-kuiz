import React, { useState, useEffect } from 'react';
import Board from '../components/Board';
import PlayerInfo from '../components/PlayerInfo';
import QuizModal from '../components/QuizModal';
import useGame from '../hooks/useGame';
import { gameService } from '../services/socketService';
import socket from '../socket/index';

export const Game = ({ roomCode, room, socketId, onLeaveGame }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const {
    gameState,
    currentQuestion,
    showQuizModal,
    setShowQuizModal,
    answerFeedback,
    gameOver,
    finalState,
    handleSelectCell,
    handleSubmitAnswer
  } = useGame(roomCode);

  useEffect(() => {
    if (!gameStarted && gameState) {
      setGameStarted(true);
    }
  }, [gameState, gameStarted]);

  useEffect(() => {
    if (gameOver && finalState && finalState.winner) {
      // Only show game over when someone actually won or all 3 rounds done
      setShowGameOver(true);
    }
  }, [gameOver]);

  const handleStartGame = async () => {
    try {
      await gameService.startGame(roomCode);
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const handleLeave = () => {
    setShowLeaveConfirm(true);
  };

  const confirmLeave = () => {
    socket.emit('leave-room', { roomCode });
    onLeaveGame();
  };

  const cancelLeave = () => {
    setShowLeaveConfirm(false);
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setShowGameOver(false);
    handleStartGame();
  };

  if (showGameOver && finalState && finalState.winner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">
              {finalState.winner === 'draw' ? '🤝' : '🏆'}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {finalState.winner === 'draw'
                ? 'It\'s a Draw!'
                : `${finalState.players.find(p => p.socketId === finalState.winner)?.name} Wins!`}
            </h1>
          </div>

          <div className="space-y-4 mb-6">
            {finalState.players.map((player) => (
              <div key={player.socketId} className="p-4 bg-gray-100 rounded-lg">
                <div className="font-semibold">{player.name}</div>
                <div className="text-sm text-gray-600">
                  Score: {player.score} | Lives: {player.lives}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button onClick={handleLeave} className="btn-secondary w-full">
              ← Back to Lobby
            </button>
          </div>
        </div>
        
        {showLeaveConfirm && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          >
            <div className="card max-w-sm w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Confirm Leave?</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to leave the game?</p>
              <div className="flex gap-3">
                <button onClick={cancelLeave} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={confirmLeave} className="btn-danger flex-1">
                  Leave
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">🎮 Waiting for Game Start</h1>

          <div className="mb-6 space-y-3">
            <div className="text-sm text-gray-600">
              Room Code: <span className="font-mono font-bold text-lg">{roomCode}</span>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Players in Room</label>
              {room?.players && room.players.map((player) => (
                <div key={player.socketId} className="p-2 bg-gray-100 rounded mb-2">
                  {player.name} {player.socketId === socketId && '(You)'}
                </div>
              ))}
            </div>
          </div>

          {room?.players?.length === 2 ? (
            <button
              onClick={handleStartGame}
              className="btn-primary w-full mb-3"
            >
              ▶️ Start Game
            </button>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-3">
              ⏳ Waiting for second player...
            </div>
          )}

          <button onClick={handleLeave} className="btn-secondary w-full">
            ← Leave Room
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading game...</div>
      </div>
    );
  }

  const isPlayerTurn = gameState.currentTurn === socketId;

  // Get difficulty level from round
  const getDifficultyLabel = (round) => {
    switch(round) {
      case 1: return 'MUDAH (Easy)';
      case 2: return 'MENENGAH (Medium)';
      case 3: return 'SULIT (Hard)';
      default: return 'MUDAH (Easy)';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white">
            <div className="text-2xl font-bold">🎮 Round {gameState.round}</div>
            <div className="text-lg font-semibold text-yellow-200">📚 Level: {getDifficultyLabel(gameState.round)}</div>
          </div>
          <button
            onClick={handleLeave}
            className="btn-danger"
          >
            🚪 Leave Game
          </button>
        </div>

        <PlayerInfo
          players={gameState.players}
          currentTurn={gameState.currentTurn}
          currentPlayerId={socketId}
        />

        <div className="mb-8">
          <Board
            board={gameState.board}
            onCellClick={handleSelectCell}
            disabled={!isPlayerTurn || showQuizModal}
          />
        </div>

        {!isPlayerTurn && (
          <div className="text-center mb-4 text-white font-semibold">
            ⏳ Waiting for opponent...
          </div>
        )}

        <QuizModal
          isOpen={showQuizModal}
          question={currentQuestion}
          onSubmitAnswer={handleSubmitAnswer}
          feedback={answerFeedback}
          round={gameState.round}
          onClose={() => {
            if (!answerFeedback) {
              setShowQuizModal(false);
            }
          }}
        />
        
        {showLeaveConfirm && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          >
            <div className="card max-w-sm w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Confirm Leave?</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to leave the game? Your opponent will win.</p>
              <div className="flex gap-3">
                <button onClick={cancelLeave} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={confirmLeave} className="btn-danger flex-1">
                  Leave Game
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
