import socket from '../socket/index';

export const roomService = {
  createRoom: (theme, playerName) => {
    return new Promise((resolve, reject) => {
      try {
        console.log('Emitting create-room:', { theme, playerName });
        socket.emit('create-room', { theme, playerName });
        
        const timeout = setTimeout(() => {
          console.log('Create room timeout');
          socket.off('room-created');
          socket.off('error');
          reject(new Error('Create room timeout - please check your connection'));
        }, 5000);

        socket.once('room-created', (data) => {
          console.log('Received room-created:', data);
          clearTimeout(timeout);
          resolve(data);
        });

        socket.once('error', (error) => {
          console.log('Received error:', error);
          clearTimeout(timeout);
          reject(new Error(error.message || 'Failed to create room'));
        });
      } catch (error) {
        console.error('Socket emit error:', error);
        reject(new Error('Connection error'));
      }
    });
  },

  joinRoom: (roomCode, playerName) => {
    return new Promise((resolve, reject) => {
      try {
        console.log('Emitting join-room:', { roomCode, playerName });
        socket.emit('join-room', { roomCode, playerName });
        
        const timeout = setTimeout(() => {
          console.log('Join room timeout');
          socket.off('room-joined');
          socket.off('error');
          reject(new Error('Join room timeout - please check room code and connection'));
        }, 5000);

        socket.once('room-joined', (data) => {
          console.log('Received room-joined:', data);
          clearTimeout(timeout);
          resolve(data);
        });

        socket.once('error', (error) => {
          console.log('Received error:', error);
          clearTimeout(timeout);
          reject(new Error(error.message || 'Failed to join room'));
        });
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
      
      const timeout = setTimeout(() => {
        socket.off('game-started');
        socket.off('error');
        reject(new Error('Start game timeout'));
      }, 5000);

      socket.once('game-started', (data) => {
        clearTimeout(timeout);
        resolve(data);
      });

      socket.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
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
