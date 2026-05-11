import socket from '../socket/index';

export const roomService = {
  createRoom: (theme, playerName) => {
    if (!socket.connected) {
      return Promise.reject(new Error('Tidak terhubung ke server. Pastikan backend berjalan dan refresh halaman.'));
    }

    return new Promise((resolve, reject) => {
      try {
        console.log('Emitting create-room:', { theme, playerName });
        socket.emit('create-room', { theme, playerName });
        
        const handleRoomCreated = (data) => {
          console.log('Received room-created:', data);
          clearTimeout(timeout);
          socket.off('error', handleError);
          resolve(data);
        };

        const handleError = (error) => {
          console.log('Received error:', error);
          clearTimeout(timeout);
          socket.off('room-created', handleRoomCreated);
          reject(new Error(error.message || 'Gagal membuat room'));
        };

        const timeout = setTimeout(() => {
          console.log('Create room timeout');
          socket.off('room-created', handleRoomCreated);
          socket.off('error', handleError);
          reject(new Error('Timeout membuat room. Periksa koneksi internet dan coba lagi.'));
        }, 5000);

        socket.once('room-created', handleRoomCreated);
        socket.once('error', handleError);
      } catch (error) {
        console.error('Socket emit error:', error);
        reject(new Error('Connection error'));
      }
    });
  },

  joinRoom: (roomCode, playerName) => {
    if (!socket.connected) {
      return Promise.reject(new Error('Tidak terhubung ke server. Pastikan backend berjalan dan refresh halaman.'));
    }

    return new Promise((resolve, reject) => {
      try {
        console.log('Emitting join-room:', { roomCode, playerName });
        socket.emit('join-room', { roomCode, playerName });
        
        const handleRoomJoined = (data) => {
          console.log('Received room-joined:', data);
          clearTimeout(timeout);
          socket.off('error', handleError);
          resolve(data);
        };

        const handleError = (error) => {
          console.log('Received error:', error);
          clearTimeout(timeout);
          socket.off('room-joined', handleRoomJoined);
          reject(new Error(error.message || 'Gagal bergabung room'));
        };

        const timeout = setTimeout(() => {
          console.log('Join room timeout');
          socket.off('room-joined', handleRoomJoined);
          socket.off('error', handleError);
          reject(new Error('Timeout bergabung room. Periksa kode room dan koneksi internet.'));
        }, 5000);

        socket.once('room-joined', handleRoomJoined);
        socket.once('error', handleError);
      } catch (error) {
        console.error('Socket emit error:', error);
        reject(new Error('Connection error'));
      }
    });
  },

  leaveRoom: (roomCode) => {
    socket.emit('leave-room', { roomCode });
  },

  getRooms: () => {
    return new Promise((resolve) => {
      socket.emit('get-rooms');
      socket.once('rooms-list', (rooms) => {
        resolve(rooms);
      });
    });
  }
};

export const gameService = {
  startGame: (roomCode) => {
    return new Promise((resolve, reject) => {
      socket.emit('start-game', { roomCode });
      
      const handleGameStarted = (data) => {
        clearTimeout(timeout);
        socket.off('error', handleError);
        resolve(data);
      };

      const handleError = (error) => {
        clearTimeout(timeout);
        socket.off('game-started', handleGameStarted);
        reject(error);
      };

      const timeout = setTimeout(() => {
        socket.off('game-started', handleGameStarted);
        socket.off('error', handleError);
        reject(new Error('Timeout memulai game. Periksa koneksi internet.'));
      }, 5000);

      socket.once('game-started', handleGameStarted);
      socket.once('error', handleError);
    });
  },

  selectCell: (roomCode, position) => {
    socket.emit('select-cell', { roomCode, position });
  },

  submitAnswer: (roomCode, answer, position) => {
    console.log(`=== SUBMIT-ANSWER SENT ===`);
    console.log(`Room: ${roomCode}, Answer: ${answer}, Position: ${position}`);
    socket.emit('submit-answer', { roomCode, answer, position });
  },

  placeSymbol: (roomCode, position) => {
    socket.emit('place-symbol', { roomCode, position });
  },

  getGameState: (roomCode) => {
    return new Promise((resolve) => {
      socket.emit('get-game-state', { roomCode });
      socket.once('game-state', (state) => {
        resolve(state);
      });
    });
  }
};

export default { roomService, gameService };
