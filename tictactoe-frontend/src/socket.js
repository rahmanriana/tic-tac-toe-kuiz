import { io } from "socket.io-client";

let SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
if (SOCKET_URL && !SOCKET_URL.startsWith('http://') && !SOCKET_URL.startsWith('https://')) {
  SOCKET_URL = `https://${SOCKET_URL}`;
}
SOCKET_URL = SOCKET_URL.replace(/\/+$/, '');

const socket = io(SOCKET_URL);

socket.on('connect', () => {
  console.log('=== SOCKET CONNECTED ===', socket.id);
});

socket.on('disconnect', () => {
  console.log('=== SOCKET DISCONNECTED ===');
});

socket.on('connect_error', (error) => {
  console.error('=== SOCKET CONNECTION ERROR ===', error);
});

// Debug all incoming events
const originalOn = socket.on;
socket.on = function(event, callback) {
  if (!event.includes('connect') && !event.includes('disconnect')) {
    console.log(`[SOCKET LISTENER REGISTERED] Event: ${event}`);
  }
  return originalOn.call(this, event, callback);
};

// Also log when events are received
const originalEmit = socket.emit;
socket.emit = function(event, ...args) {
  if (!event.includes('connect') && !event.includes('ping')) {
    console.log(`[SOCKET EMIT] Event: ${event}`, args[0]);
  }
  return originalEmit.call(this, event, ...args);
};

export default socket;