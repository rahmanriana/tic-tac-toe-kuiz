import { useState, useEffect } from 'react';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import socket from './socket/index';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('lobby'); // lobby, game
  const [roomCode, setRoomCode] = useState(null);
  const [room, setRoom] = useState(null);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    // Wait for socket connection before setting socketId
    const handleConnect = () => {
      console.log('Socket connected, setting socketId:', socket.id);
      setSocketId(socket.id);
    };

    if (socket.connected) {
      setSocketId(socket.id);
    } else {
      socket.on('connect', handleConnect);
    }

    const handlePlayerJoined = (data) => {
      console.log('Player joined:', data);
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          players: [...prev.players, data.player]
        };
      });
    };

    const handlePlayerLeft = (data) => {
      console.log('Player left:', data);
      setRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          players: prev.players.filter(p => p.socketId !== data.player.socketId)
        };
      });
    };

    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('player-joined', handlePlayerJoined);
      socket.off('player-left', handlePlayerLeft);
    };
  }, []);

  const handleRoomCreated = (data) => {
    console.log('Room created:', data);
    console.log('Setting roomCode:', data.roomCode);
    console.log('Setting room:', data.room);
    setRoomCode(data.roomCode);
    setRoom(data.room);
    setCurrentPage('game');
  };

  const handleRoomJoined = (data) => {
    console.log('=== ROOM JOINED DEBUG ===');
    console.log('Raw data received:', data);
    console.log('Room code:', data.roomCode);
    console.log('Room data:', data.room);
    console.log('Current socketId:', socket.id);
    console.log('Setting currentPage to game');

    setRoomCode(data.roomCode);
    setRoom(data.room);
    setCurrentPage('game');

    console.log('State updated - currentPage should be game now');
  };

  const handleLeaveGame = () => {
    setCurrentPage('lobby');
    setRoomCode(null);
    setRoom(null);
  };

  return (
    <div className="App">
      {(() => {
        console.log('=== RENDER DEBUG ===');
        console.log('currentPage:', currentPage);
        console.log('roomCode:', roomCode);
        console.log('room:', room);
        console.log('socketId:', socketId);

        try {
          if (currentPage === 'lobby') {
            console.log('Rendering Lobby component');
            return (
              <Lobby
                onRoomCreated={handleRoomCreated}
                onRoomJoined={handleRoomJoined}
              />
            );
          } else if (currentPage === 'game' && roomCode && room && socketId) {
            console.log('Rendering Game component');
            return (
              <Game
                roomCode={roomCode}
                room={room}
                socketId={socketId}
                onLeaveGame={handleLeaveGame}
              />
            );
          } else {
            console.log('=== RENDER DEBUG ===');
            console.log('currentPage:', currentPage);
            console.log('roomCode:', roomCode);
            console.log('room:', room);
            console.log('socketId:', socketId);
            console.log('Rendering fallback - conditions not met');
            console.log('currentPage === game:', currentPage === 'game');
            console.log('roomCode exists:', !!roomCode);
            console.log('room exists:', !!room);
            console.log('socketId exists:', !!socketId);
            return (
              <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
                <div className="card max-w-md w-full text-center">
                  <h1 className="text-2xl font-bold mb-4">Loading...</h1>
                  <p className="text-gray-600">Please wait while we connect you to the game.</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Debug Info:</p>
                    <p>Page: {currentPage}</p>
                    <p>Room Code: {roomCode || 'null'}</p>
                    <p>Room: {room ? 'exists' : 'null'}</p>
                    <p>Socket ID: {socketId || 'null'}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPage('lobby');
                      setRoomCode(null);
                      setRoom(null);
                    }}
                    className="btn-secondary mt-4"
                  >
                    Back to Lobby
                  </button>
                </div>
              </div>
            );
          }
        } catch (error) {
          console.error('Error rendering app:', error);
          return (
            <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
              <div className="card max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Error Occurred</h1>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-danger"
                >
                  Reload Page
                </button>
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
}

export default App;
