import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import socket from './socket/index';
import './App.css';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RoomRoute({ user, roomCodeState, roomState, socketId, onLeaveGame }) {
  const params = useParams();
  const roomCodeParam = params.roomCode;

  // Prefer URL roomCode so refresh/deeplink works; fallback to state/session.
  const roomCode = roomCodeParam || roomCodeState;
  const room = roomState;

  return (
    <ProtectedRoute user={user}>
      <Game
        roomCode={roomCode}
        room={room}
        socketId={socketId}
        username={user?.username}
        onLeaveGame={onLeaveGame}
      />
    </ProtectedRoute>
  );
}

function App() {
  // Important: init synchronously from storage to avoid redirect-to-login on refresh.
  const [user, setUser] = useState(() => {
    try {
      // sessionStorage is per-tab (multi-account testing in different tabs)
      const raw = sessionStorage.getItem('tictactoe_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [roomCode, setRoomCode] = useState(() => {
    try {
      return sessionStorage.getItem('tictactoe_roomCode') || null;
    } catch {
      return null;
    }
  });

  const [room, setRoom] = useState(() => {
    try {
      const raw = sessionStorage.getItem('tictactoe_room');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [socketId, setSocketId] = useState(null);
  const navigate = useNavigate();

  // Persist latest room state for refresh in /lobby or /game
  useEffect(() => {
    try {
      if (roomCode) sessionStorage.setItem('tictactoe_roomCode', roomCode);
      else sessionStorage.removeItem('tictactoe_roomCode');
      if (room) sessionStorage.setItem('tictactoe_room', JSON.stringify(room));
      else sessionStorage.removeItem('tictactoe_room');
    } catch {
      // ignore
    }
  }, [roomCode, room]);

  // Keep socketId updated and re-announce presence after reconnect.
  useEffect(() => {
    const announce = () => {
      if (user?.id && user?.username) {
        socket.emit('user-online', { userId: user.id, username: user.username });
      }
    };

    const handleConnect = () => {
      setSocketId(socket.id);
      announce();

      // If user refreshes while in lobby/game, rejoin Socket.IO room so realtime (chat/game) keeps working.
      if (roomCode && user?.username) {
        socket.emit('rejoin-room', { roomCode, playerName: user.username });
      }
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on('connect', handleConnect);
    return () => {
      socket.off('connect', handleConnect);
    };
  }, [user, roomCode]);

  // Room lifecycle events (keep once per mount)
  useEffect(() => {
    const handleRoomCreated = (data) => {
      setRoomCode(data.roomCode);
      setRoom(data.room);
      navigate(`/room/${data.roomCode}`);
    };

    const handleRoomJoined = (data) => {
      setRoomCode(data.roomCode);
      setRoom(data.room);
      navigate(`/room/${data.roomCode}`);
    };

    const handleRoomUpdated = (data) => {
      if (data?.roomCode && data.roomCode === roomCode && data.room) {
        setRoom(data.room);
      }
    };

    const handlePlayerJoined = (data) => {
      if (!data?.roomCode || data.roomCode !== roomCode || !data.player) return;
      setRoom((prev) => {
        if (!prev) return prev;
        const exists = prev.players?.some((p) => p.socketId === data.player.socketId);
        if (exists) return prev;
        return { ...prev, players: [...(prev.players || []), data.player] };
      });
    };

    const handlePlayerLeft = (data) => {
      if (!data?.roomCode || data.roomCode !== roomCode || !data.player) return;
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, players: (prev.players || []).filter((p) => p.socketId !== data.player.socketId) };
      });
    };

    socket.on('room-created', handleRoomCreated);
    socket.on('room-joined', handleRoomJoined);
    socket.on('room-updated', handleRoomUpdated);
    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);

    return () => {
      socket.off('room-created', handleRoomCreated);
      socket.off('room-joined', handleRoomJoined);
      socket.off('room-updated', handleRoomUpdated);
      socket.off('player-joined', handlePlayerJoined);
      socket.off('player-left', handlePlayerLeft);
    };
  }, [navigate, roomCode]);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('tictactoe_user', JSON.stringify(userData));
    if (socket.connected) {
      socket.emit('user-online', { userId: userData.id, username: userData.username });
    }
  };

  const handleLogout = () => {
    if (user) {
      socket.emit('user-offline', { userId: user.id, username: user.username });
    }
    sessionStorage.removeItem('tictactoe_user');
    sessionStorage.removeItem('tictactoe_roomCode');
    sessionStorage.removeItem('tictactoe_room');
    setUser(null);
    setRoomCode(null);
    setRoom(null);
    navigate('/login');
  };

  const handleRoomCreatedManually = (data) => {
    setRoomCode(data.roomCode);
    setRoom(data.room);
    navigate(`/room/${data.roomCode}`);
  };

  const handleRoomJoinedManually = (data) => {
    setRoomCode(data.roomCode);
    setRoom(data.room);
    navigate(`/room/${data.roomCode}`);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Home
                user={user}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lobby"
          element={
            <ProtectedRoute user={user}>
              <Lobby
                userName={user?.username || ''}
                onRoomCreated={handleRoomCreatedManually}
                onRoomJoined={handleRoomJoinedManually}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute user={user}>
              <Navigate to={roomCode ? `/room/${roomCode}` : '/lobby'} replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomCode"
          element={
            <RoomRoute
              user={user}
              roomCodeState={roomCode}
              roomState={room}
              socketId={socketId}
              onLeaveGame={() => {
                socket.emit('leave-room', { roomCode: roomCode });
                setRoomCode(null);
                setRoom(null);
                navigate('/');
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </div>
  );
}

export default App;
