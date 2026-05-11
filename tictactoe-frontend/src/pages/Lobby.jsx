import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../services/socketService';

export const Lobby = ({ userName, onRoomCreated, onRoomJoined }) => {
  const [playerName, setPlayerName] = useState(userName || '');
  const [selectedTheme, setSelectedTheme] = useState('umum');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState([]);
  const [tab, setTab] = useState('create'); // 'create' | 'join'
  const navigate = useNavigate();

  const themes = useMemo(
    () => [
      { id: 'nasionalisme', name: 'Nasionalisme', emoji: '🇮🇩' },
      { id: 'teknologi', name: 'Teknologi', emoji: '💻' },
      { id: 'sejarah', name: 'Sejarah', emoji: '📚' },
      { id: 'politik', name: 'Politik', emoji: '🏛️' },
      { id: 'umum', name: 'Umum', emoji: '🌍' }
    ],
    []
  );

  useEffect(() => {
    if (userName) setPlayerName(userName);
  }, [userName]);

  useEffect(() => {
    const load = async () => {
      try {
        const roomsList = await roomService.getRooms();
        setRooms(roomsList || []);
      } catch (err) {
        // non-blocking
        console.error('Error loading rooms:', err);
      }
    };

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Nama pemain harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await roomService.createRoom(selectedTheme, playerName.trim());
      onRoomCreated(result);
    } catch (err) {
      setError(err.message || 'Gagal membuat room');
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Nama pemain harus diisi');
      return;
    }
    if (!roomCode.trim()) {
      setError('Kode room harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await roomService.joinRoom(roomCode.trim(), playerName.trim());
      onRoomJoined(result);
    } catch (err) {
      setError(err.message || 'Gagal bergabung room');
      setLoading(false);
    }
  };

  const handleJoinFromList = async (code) => {
    setRoomCode(code);
    if (!playerName.trim()) {
      setError('Nama pemain harus diisi terlebih dahulu');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const result = await roomService.joinRoom(code, playerName.trim());
      onRoomJoined(result);
    } catch (err) {
      setError(err.message || 'Gagal bergabung room');
      setLoading(false);
    }
  };

  return (
    <div className="lobby-page min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 relative">
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

      <div className="page-shell relative z-10">
        <button
          onClick={() => navigate('/')}
          className="mb-5 inline-flex items-center gap-2 text-white transition-colors text-base font-extrabold"
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.22)'
          }}
        >
          ← Back
        </button>

        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-white">Room Lobby</h1>
          <p className="text-slate-200/80 mt-2">Create room atau join room untuk mulai bermain.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-400/30 text-red-50 flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <div className="glass-card glass-panel max-w-3xl mx-auto" style={{ background: 'rgba(15,23,42,0.55)' }}>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab('create')}
              className="flex-1 py-3 rounded-2xl font-extrabold transition-all border"
              style={{
                background:
                  tab === 'create'
                    ? 'linear-gradient(90deg, rgba(168,85,247,0.95), rgba(99,102,241,0.95), rgba(59,130,246,0.95))'
                    : 'rgba(255,255,255,0.10)',
                borderColor: tab === 'create' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)',
                color: 'white'
              }}
            >
              + Create
            </button>
            <button
              onClick={() => setTab('join')}
              className="flex-1 py-3 rounded-2xl font-extrabold transition-all border"
              style={{
                background:
                  tab === 'join'
                    ? 'linear-gradient(90deg, rgba(168,85,247,0.95), rgba(99,102,241,0.95), rgba(59,130,246,0.95))'
                    : 'rgba(255,255,255,0.10)',
                borderColor: tab === 'join' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)',
                color: 'white'
              }}
            >
              🔗 Join
            </button>
          </div>

          {/* Shared: player name */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
              Player Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Masukkan nama pemain..."
              className="w-full input"
              disabled={loading}
            />
          </div>

          {tab === 'create' && (
            <form onSubmit={handleCreateRoom}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
                  Select Theme (Host)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {themes.map((thm) => (
                    <button
                      type="button"
                      key={thm.id}
                      onClick={() => setSelectedTheme(thm.id)}
                      className="p-4 rounded-2xl border text-left transition-all"
                      style={{
                        background: selectedTheme === thm.id ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.10)',
                        borderColor:
                          selectedTheme === thm.id ? 'rgba(34,211,238,0.75)' : 'rgba(255,255,255,0.20)',
                        boxShadow:
                          selectedTheme === thm.id ? '0 0 0 3px rgba(34,211,238,0.18)' : 'none',
                        color: 'white'
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-extrabold text-white">
                            {selectedTheme === thm.id ? '✅ ' : ''}
                            {thm.name}
                          </p>
                          <p className="text-xs text-slate-200/80 mt-1">Tema quiz untuk game</p>
                        </div>
                        <div className="text-2xl">{thm.emoji}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-5 rounded-2xl text-white font-extrabold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(90deg, #a855f7, #6366f1, #3b82f6)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  boxShadow:
                    '0 18px 40px rgba(59,130,246,0.35), 0 0 0 4px rgba(255,255,255,0.06)'
                }}
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </form>
          )}

          {tab === 'join' && (
            <form onSubmit={handleJoinRoom}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan kode room (contoh: ABC123)"
                  className="w-full input font-mono text-lg tracking-widest"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-5 rounded-2xl text-white font-extrabold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(90deg, #a855f7, #6366f1, #3b82f6)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  boxShadow:
                    '0 18px 40px rgba(59,130,246,0.35), 0 0 0 4px rgba(255,255,255,0.06)'
                }}
              >
                {loading ? 'Joining...' : 'Join Room'}
              </button>

              {/* Available rooms */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-white/90 uppercase tracking-wider">Rooms</p>
                  <p className="text-xs text-slate-200/70">{rooms.length} tersedia</p>
                </div>

                {rooms.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white/5 text-center text-slate-200/80">
                    Belum ada room tersedia.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rooms.map((room) => (
                      <button
                        type="button"
                        key={room.roomCode}
                        onClick={() => handleJoinFromList(room.roomCode)}
                        disabled={loading}
                        className="w-full p-4 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/15 hover:border-white/25 transition-all text-left disabled:opacity-60"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-extrabold text-white">Code: {room.roomCode}</p>
                            <p className="text-sm text-slate-200/70 mt-1">Host: {room.host}</p>
                          </div>
                          <div className="text-xl">🎮</div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-200/70 mt-3">
                          <span>Tema: {room.theme}</span>
                          <span>
                            {room.playerCount}/{room.maxPlayers} pemain
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
