import React, { useState, useEffect } from 'react';
import socket from '../socket/index';
import { roomService } from '../services/socketService';

export const Lobby = ({ onRoomCreated, onRoomJoined }) => {
  const [playerName, setPlayerName] = useState('');
  const [theme, setTheme] = useState('nasionalisme');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState([]);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  const themes = ['nasionalisme', 'umum', 'politik', 'sejarah', 'teknologi', 'olahraga'];

  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadRooms = async () => {
    try {
      const roomsList = await roomService.getRooms();
      setRooms(roomsList || []);
    } catch (err) {
      console.error('Error loading rooms:', err);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Creating room with:', { theme, playerName });
      const result = await roomService.createRoom(theme, playerName);
      console.log('Room creation result:', result);
      onRoomCreated(result);
    } catch (err) {
      console.error('Failed to create room:', err);
      setError(err.message || 'Failed to create room');
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      setError('Please enter room code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Joining room with:', { roomCode, playerName });
      const result = await roomService.joinRoom(roomCode, playerName);
      console.log('Room join result:', result);
      onRoomJoined(result);
    } catch (err) {
      console.error('Failed to join room:', err);
      setError(err.message || 'Failed to join room');
      setLoading(false);
    }
  };

  const handleJoinFromList = async (code) => {
    setRoomCode(code);
    if (!playerName.trim()) {
      setError('Please enter your name first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await roomService.joinRoom(code, playerName);
      onRoomJoined(result);
    } catch (err) {
      setError(err.message || 'Failed to join room');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-600">
          🎮 Tic-Tac-Toe Quiz
        </h1>

        

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateRoom} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="input"
              disabled={loading}
            />
          </div>
          
          {!showJoinRoom && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Select Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="input"
                  disabled={loading}
                >
                  {themes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Creating...' : '➕ Create Room'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowJoinRoom(true)}
                className="btn-secondary w-full"
              >
                🔗 Join Room
              </button>
            </>
          )}

          {showJoinRoom && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2">Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter room code (e.g., ABC123)"
                  className="input"
                  disabled={loading}
                  maxLength="6"
                />
              </div>

              <button
                type="button"
                onClick={handleJoinRoom}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Joining...' : '✅ Join Room'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowJoinRoom(false);
                  setRoomCode('');
                }}
                className="btn-secondary w-full"
              >
                ← Back
              </button>
            </>
          )}
        </form>

        {rooms.length > 0 && !showJoinRoom && (
          <div className="mt-8 pt-8 border-t border-gray-300">
            <h3 className="font-semibold mb-4">Available Rooms</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {rooms.map((room) => (
                <button
                  key={room.roomCode}
                  onClick={() => handleJoinFromList(room.roomCode)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <div className="font-semibold">{room.roomCode}</div>
                  <div className="text-sm text-gray-600">
                    {room.host} • {room.theme} • {room.playerCount}/{room.maxPlayers}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
