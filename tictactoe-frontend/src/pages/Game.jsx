  import React, { useEffect, useMemo, useState } from 'react';
import Board from '../components/Board';
import QuizModal from '../components/QuizModal';
import useGame from '../hooks/useGame';
import { gameService } from '../services/socketService';
import socket from '../socket/index';
import FloatingChatButton from '../components/FloatingChatButton';
import ChatPopup from '../components/ChatPopup';

export const Game = ({ roomCode, room, socketId, username, onLeaveGame }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [previewMessage, setPreviewMessage] = useState('');

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

  const isHost = room?.host && socketId && room.host === socketId;
  const players = room?.players || [];

  const themes = useMemo(
    () => [
      { id: 'nasionalisme', label: 'Nasionalisme' },
      { id: 'teknologi', label: 'Teknologi' },
      { id: 'sejarah', label: 'Sejarah' },
      { id: 'politik', label: 'Politik' },
      { id: 'umum', label: 'Umum' }
    ],
    []
  );

  useEffect(() => {
    if (!gameStarted && gameState) setGameStarted(true);
  }, [gameState, gameStarted]);

  useEffect(() => {
    if (gameOver && finalState && finalState.winner) setShowGameOver(true);
  }, [gameOver, finalState]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      if (data?.roomCode !== roomCode) return;
      setChatMessages((current) => [...current, data]);
      if (!chatOpen) {
        setNotificationCount((count) => count + 1);
        setPreviewMessage(`${data.sender_username}: ${data.message}`);
        window.setTimeout(() => setPreviewMessage(''), 3500);
      }
    };

    socket.on('receive-message', handleReceiveMessage);
    return () => socket.off('receive-message', handleReceiveMessage);
  }, [roomCode, chatOpen]);

  const handleStartGame = async () => {
    try {
      await gameService.startGame(roomCode);
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const handleLeave = () => setShowLeaveConfirm(true);
  const confirmLeave = () => {
    socket.emit('leave-room', { roomCode });
    onLeaveGame();
  };
  const cancelLeave = () => setShowLeaveConfirm(false);

  const toggleChat = () => {
    setChatOpen((open) => !open);
    if (!chatOpen) setNotificationCount(0);
  };

  const handleSendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !username) return;
    socket.emit('send-message', {
      roomCode,
      sender_username: username,
      message: trimmed
    });
    setNewMessage('');
  };

  const getDifficultyLabel = (round) => {
    switch (round) {
      case 1:
        return { label: 'MUDAH', en: 'Easy' };
      case 2:
        return { label: 'SULIT', en: 'Hard' };
      case 3:
        return { label: 'SANGAT SULIT', en: 'Very Hard' };
      default:
        return { label: 'MUDAH', en: 'Easy' };
    }
  };

  if (showGameOver && finalState && finalState.winner) {
    return (
      <div className="game-page min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950 flex items-center justify-center p-4 text-white">
        <div className="glass-card glass-panel max-w-xl w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{finalState.winner === 'draw' ? '🤝' : '🏆'}</div>
            <h1 className="text-3xl font-bold mb-2">
              {finalState.winner === 'draw'
                ? 'Pertandingan Seri!'
                : `${finalState.players.find((p) => p.socketId === finalState.winner)?.name} Menang!`}
            </h1>
            <p className="text-slate-300">Lihat hasil akhir dan kembali ke lobby.</p>
          </div>

          <div className="space-y-4 mb-6">
            {finalState.players.map((player) => (
              <div key={player.socketId} className="rounded-3xl bg-white/5 p-5 border border-white/10">
                <div className="font-semibold text-white">{player.name}</div>
                <div className="mt-2 text-sm text-slate-300">
                  Score: {player.score} • Lives: {player.lives}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleLeave} className="btn-secondary w-full">
            ← Back to Lobby
          </button>
        </div>

        {showLeaveConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 p-4 backdrop-blur-sm">
            <div className="glass-card glass-panel max-w-sm w-full">
              <p className="text-sm uppercase tracking-wider text-cyan-200 mb-2 font-bold">Konfirmasi</p>
              <h2 className="text-2xl font-bold text-white mb-4">Keluar dari room?</h2>
              <p className="text-slate-300 mb-6">Kamu akan kembali ke halaman lobby.</p>
              <div className="flex gap-3">
                <button onClick={cancelLeave} className="flex-1 btn-secondary">
                  Batal
                </button>
                <button onClick={confirmLeave} className="flex-1 btn-danger">
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Room Lobby (before game-started)
  if (!gameStarted) {
    const themeValue = room?.theme || 'umum';
    const canStart = Boolean(roomCode) && players.length === 2;

    return (
      <div className="game-page min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 relative p-4 md:p-6 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute rounded-full"
            style={{
              top: '-5rem',
              left: '-5rem',
              width: '28rem',
              height: '28rem',
              background: 'rgba(147, 51, 234, 0.45)',
              filter: 'blur(64px)',
              opacity: 0.55,
              mixBlendMode: 'multiply',
              animation: 'float 7s ease-in-out infinite'
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: '-7rem',
              right: '-5rem',
              width: '28rem',
              height: '28rem',
              background: 'rgba(59, 130, 246, 0.45)',
              filter: 'blur(64px)',
              opacity: 0.55,
              mixBlendMode: 'multiply',
              animation: 'float 7s ease-in-out infinite 2s'
            }}
          />
      </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, 30px); }
          }
        `}</style>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="glass-card glass-panel" style={{ background: 'rgba(15,23,42,0.55)' }}>
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
              <div>
                <p className="text-sm uppercase tracking-widest text-cyan-200 font-bold">Room Lobby</p>
                <h1 className="text-3xl md:text-4xl font-black text-white mt-2">Siap bermain?</h1>
                <p className="text-slate-200/80 mt-2">
                  Host pilih tema, lalu klik start untuk masuk gameplay realtime.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                <p className="text-xs text-slate-200/70 uppercase tracking-wider font-bold">Room Code</p>
                <p className="mt-1 font-mono text-lg font-extrabold">{roomCode || '-'}</p>
              </div>
            </div>

            {/* Players */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[0, 1].map((idx) => {
                const p = players[idx];
                const isMe = p?.name && username && p.name === username;
                return (
                  <div key={idx} className="rounded-3xl bg-white/8 border border-white/15 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center font-extrabold text-white">
                          {(p?.name?.[0] || '?').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-extrabold truncate">
                            {p?.name || (idx === 0 ? 'Waiting player...' : 'Waiting player...')}
                          </p>
                          <p className="text-xs text-slate-200/70 mt-1">
                            {p?.symbol ? `Player ${p.symbol}` : 'Not joined'}
                            {isMe ? ' • You' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-white/90">{idx === 0 ? 'X' : 'O'}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Theme */}
            <div className="rounded-3xl bg-white/6 border border-white/12 p-5 mb-6">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <div>
                  <p className="text-sm font-extrabold text-white">Select Theme</p>
                  <p className="text-xs text-slate-200/70 mt-1">
                    {isHost ? 'Hanya host yang bisa mengubah tema.' : 'Menunggu host memilih tema.'}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold">
                  Current: {themeValue}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themes.map((t) => {
                  const selected = t.id === themeValue;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={!isHost}
                      onClick={() => socket.emit('set-room-theme', { roomCode, theme: t.id })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                        selected
                          ? 'bg-cyan-400/40 border-cyan-300 shadow-lg shadow-cyan-400/50'
                          : 'bg-white/12 border-white/25 hover:bg-white/15'
                      }`}
                    >
                      <p className={`font-extrabold text-base ${
                        selected ? 'text-white' : 'text-white'
                      }`}>{selected ? '✅ ' : ''}{t.label}</p>
                      <p className={`text-xs mt-1 ${
                        selected ? 'text-cyan-50' : 'text-slate-100'
                      }`}>Tema quiz untuk game</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {canStart ? (
                <button
                  type="button"
                  onClick={handleStartGame}
                  disabled={!isHost}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-extrabold text-lg hover:shadow-lg hover:shadow-blue-400/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  🎮 Start Game
                </button>
              ) : (
                <div className="rounded-3xl bg-yellow-400/15 text-yellow-50 p-4 border border-yellow-200/20">
                  ⏳ Menunggu pemain kedua bergabung...
                </div>
              )}

              <button type="button" onClick={handleLeave} className="btn-secondary w-full">
                ← Leave Room
              </button>
            </div>
          </div>
        </div>

        {showLeaveConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 p-4 backdrop-blur-sm">
            <div className="glass-card glass-panel max-w-sm w-full">
              <p className="text-sm uppercase tracking-wider text-cyan-200 mb-2 font-bold">Konfirmasi</p>
              <h2 className="text-2xl font-bold text-white mb-4">Keluar dari room?</h2>
              <p className="text-slate-300 mb-6">Kamu akan kembali ke halaman home.</p>
              <div className="flex gap-3">
                <button type="button" onClick={cancelLeave} className="flex-1 btn-secondary">
                  Batal
                </button>
                <button type="button" onClick={confirmLeave} className="flex-1 btn-danger">
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading game...</div>
      </div>
    );
  }

  const isPlayerTurn = gameState.currentTurn === socketId;

  return (
    <div
      className="game-page min-h-screen relative p-4 md:p-6 text-white"
      style={{
        background: 'linear-gradient(180deg, #7c3aed 0%, #3b82f6 100%)'
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute rounded-full"
          style={{
            top: '-5rem',
            left: '-5rem',
            width: '28rem',
            height: '28rem',
            background: 'rgba(147, 51, 234, 0.42)',
            filter: 'blur(64px)',
            opacity: 0.5,
            mixBlendMode: 'multiply',
            animation: 'float 7s ease-in-out infinite'
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '-7rem',
            right: '-5rem',
            width: '28rem',
            height: '28rem',
            background: 'rgba(59, 130, 246, 0.42)',
            filter: 'blur(64px)',
            opacity: 0.5,
            mixBlendMode: 'multiply',
            animation: 'float 7s ease-in-out infinite 2s'
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* HUD */}
        <div className="mb-6">
          <div className="flex flex-col gap-1">
            <div className="text-2xl md:text-3xl font-black">🎮 Round {gameState.round}</div>
            <div className="text-base md:text-lg font-extrabold opacity-90">
              {(() => {
                const d = getDifficultyLabel(gameState.round);
                return `📚 Level: ${d.label} (${d.en})`;
              })()}
            </div>
          </div>
        </div>

        {/* Player Cards (centered, side-by-side like reference) */}
        <div className="mb-7 flex justify-center">
          <div className="flex justify-center flex-wrap" style={{ width: 'min(100%, 560px)', columnGap: '2.25rem', rowGap: '1.25rem' }}>
            {gameState.players.map((player) => {
              const isCurrentTurn = player.socketId === gameState.currentTurn;
              return (
                <div
                  key={player.socketId}
                  className="rounded-2xl transition-all"
                  style={{
                    width: 'min(46vw, 200px)',
                    background: 'rgba(255,255,255,0.95)',
                    color: '#0f172a',
                    border: `2px solid ${isCurrentTurn ? '#22c55e' : 'rgba(148,163,184,0.65)'}`,
                    boxShadow: isCurrentTurn
                      ? '0 0 0 3px rgba(34,197,94,0.20)'
                      : '0 10px 30px rgba(15,23,42,0.18)',
                    padding: '1.25rem'
                  }}
                >
                  <div>
                    <p className="text-sm font-extrabold" style={{ color: '#0f172a' }}>
                      {player.name}
                    </p>
                    <p className="text-5xl font-black mt-3" style={{ color: '#0f172a', lineHeight: 1 }}>
                      {player.symbol}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm font-semibold">
                    <span style={{ color: '#334155' }}>Lives:</span>
                    <span style={{ color: '#0f172a' }}>❤️ {player.lives}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                    <span style={{ color: '#334155' }}>Score:</span>
                    <span style={{ color: '#0f172a' }}>⭐ {player.score}</span>
                  </div>

                  {isCurrentTurn ? (
                    <div className="mt-5 text-sm font-extrabold" style={{ color: '#f59e0b' }}>
                      Your Turn! 🎮
                    </div>
                  ) : (
                    <div className="mt-5 text-sm font-extrabold" style={{ color: 'transparent' }}>
                      &nbsp;
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Board */}
        <div className="mb-6 rounded-3xl p-6 shadow-xl" style={{ background: 'rgba(255,255,255,0.22)' }}>
          <div className="flex justify-center">
            <Board board={gameState.board} onCellClick={handleSelectCell} disabled={!isPlayerTurn || showQuizModal} />
          </div>
        </div>

        {!isPlayerTurn && (
          <div className="mb-5 p-4 rounded-2xl bg-yellow-400/20 border border-yellow-200/30 text-center text-yellow-50 font-semibold">
            ⏳ Menunggu lawan bermain...
          </div>
        )}

        {/* Leave Button (bottom center) */}
        <div className="flex justify-center">
          <button
            onClick={handleLeave}
            className="px-10 py-3 rounded-xl text-white font-extrabold transition-all"
            style={{
              background: '#ef4444',
              boxShadow: '0 10px 25px rgba(239,68,68,0.35)'
            }}
          >
            Leave Game
          </button>
        </div>

        <QuizModal
          isOpen={showQuizModal}
          question={currentQuestion}
          onSubmitAnswer={handleSubmitAnswer}
          feedback={answerFeedback}
          round={gameState.round}
          onClose={() => {
            if (!answerFeedback) setShowQuizModal(false);
          }}
        />
      </div>

      {/* Leave Confirmation */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-card glass-panel max-w-sm w-full">
            <p className="text-sm uppercase tracking-wider text-cyan-200 mb-2 font-bold">Konfirmasi</p>
            <h2 className="text-2xl font-bold text-white mb-4">Keluar dari Game?</h2>
            <p className="text-slate-300 mb-6">Jika kamu keluar, game akan berakhir.</p>
            <div className="flex gap-3">
              <button onClick={cancelLeave} className="flex-1 btn-secondary">
                Batal
              </button>
              <button onClick={confirmLeave} className="flex-1 btn-danger">
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingChatButton count={notificationCount} preview={previewMessage} onClick={toggleChat} />

      {chatOpen && (
        <ChatPopup
          messages={chatMessages}
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
          onClose={toggleChat}
          username={username}
          roomCode={roomCode}
        />
      )}
    </div>
  );
};

export default Game;
