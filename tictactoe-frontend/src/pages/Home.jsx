import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/index';
import UserCard from '../components/UserCard';
import InvitePopup from '../components/InvitePopup';

const Home = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [inviteRequest, setInviteRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    socket.emit('user-online', { userId: user.id, username: user.username });
    socket.emit('get-online-users');

    const handleUsers = (list) => {
      const normalized = Array.isArray(list) ? list : [];
      setUsers(normalized.filter((u) => u?.id !== user.id));
    };

    const handleInvite = (payload) => {
      // Extra guard: only show invite popup on the intended receiver.
      if (payload?.toUsername && payload.toUsername !== user.username) return;
      setInviteRequest(payload);
    };

    const handleConnect = () => {
      setSocketConnected(true);
      socket.emit('user-online', { userId: user.id, username: user.username });
      socket.emit('get-online-users');
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    socket.on('online-users', handleUsers);
    socket.on('receive-invite', handleInvite);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('online-users', handleUsers);
      socket.off('receive-invite', handleInvite);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [user]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => String(u?.username || '').toLowerCase().includes(q));
  }, [users, searchQuery]);

  const onlineUsers = useMemo(() => filtered.filter((u) => u?.online_status), [filtered]);
  const offlineUsers = useMemo(() => filtered.filter((u) => !u?.online_status), [filtered]);

  const handleInviteClick = (targetUser) => {
    socket.emit('invite-player', {
      fromUserId: user.id,
      fromUsername: user.username,
      toUserId: targetUser.id,
      toUsername: targetUser.username
    });
  };

  const handleAccept = () => {
    if (!inviteRequest) return;
    socket.emit('accept-invite', {
      fromUserId: inviteRequest.fromUserId,
      toUserId: user.id,
      roomCode: inviteRequest.roomCode
    });
    setInviteRequest(null);
  };

  const handleReject = () => {
    if (!inviteRequest) return;
    socket.emit('reject-invite', {
      fromUserId: inviteRequest.fromUserId,
      toUserId: user.id
    });
    setInviteRequest(null);
  };

  return (
    <div className="home-page min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 relative">
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
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-widest text-cyan-200 font-bold">Realtime Multiplayer</p>
            <h1 className="text-4xl md:text-5xl font-black mt-2 text-white truncate">
              Hai, {user.username} <span className="inline-block">👋</span>
            </h1>
            <p className="text-slate-200 mt-3 max-w-2xl">
              Cari pemain lain, invite realtime, atau buat room untuk mulai bermain.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/15">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  socketConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}
              />
              <span className="text-sm font-semibold text-white">
                {socketConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold border border-white/15 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 flex items-center pointer-events-none" style={{ left: '18px' }}>
              <span
                className="text-lg"
                style={{
                  color: 'rgba(255,255,255,0.95)',
                  filter: 'drop-shadow(0 6px 14px rgba(15,23,42,0.25))'
                }}
              >
                🔎
              </span>
            </div>
            <input
              type="text"
              placeholder="Search player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-4 py-4 rounded-full transition-all"
              style={{
                paddingLeft: '56px',
                background: 'rgba(255,255,255,0.22)',
                border: '1px solid rgba(255,255,255,0.55)',
                color: 'white',
                outline: 'none',
                boxShadow: '0 18px 40px rgba(15,23,42,0.18), 0 0 0 4px rgba(255,255,255,0.06)'
              }}
            />
            <style>{`
              input::placeholder { color: rgba(255,255,255,0.85); }
            `}</style>
          </div>
        </div>

        {/* Players */}
        <div className="glass-card glass-panel">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Players</h2>
              <p className="text-sm text-slate-200/80 mt-1">
                Online: <span className="font-bold text-white">{onlineUsers.length}</span> • Offline:{' '}
                <span className="font-bold text-white">{offlineUsers.length}</span>
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-bold uppercase tracking-wider">
              Live
            </span>
          </div>

          {/* Online */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-white/90 uppercase tracking-wider">Online</p>
            </div>
            <div className="space-y-3">
              {onlineUsers.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/5 text-center text-slate-200/80">
                  Belum ada pemain online.
                </div>
              ) : (
                onlineUsers.map((u) => (
                  <UserCard key={u.id} user={u} onInvite={() => handleInviteClick(u)} />
                ))
              )}
            </div>
          </div>

          {/* Offline */}
          <div>
            <p className="text-sm font-bold text-white/90 uppercase tracking-wider mb-3">Offline</p>
            <div className="space-y-3 opacity-90">
              {offlineUsers.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/5 text-center text-slate-200/80">
                  Tidak ada pemain offline.
                </div>
              ) : (
                offlineUsers.map((u) => (
                  <UserCard key={u.id} user={u} onInvite={() => handleInviteClick(u)} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/lobby')}
            className="py-4 px-5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-extrabold text-lg hover:shadow-lg hover:shadow-blue-400/40 transition-all transform hover:scale-[1.02]"
          >
            + Create Room
          </button>
          <button
            onClick={() => navigate('/lobby')}
            className="py-4 px-5 rounded-2xl bg-white/10 border border-white/20 text-white font-extrabold text-lg hover:bg-white/15 transition-all transform hover:scale-[1.02]"
          >
            🔗 Join Room
          </button>
        </div>
      </div>

      {inviteRequest && (
        <InvitePopup invite={inviteRequest} onAccept={handleAccept} onReject={handleReject} />
      )}
    </div>
  );
};

export default Home;
