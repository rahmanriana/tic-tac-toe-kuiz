import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

socket.on("connect", () => {
  console.log("=== SOCKET CONNECTED ===", socket.id);
});

socket.on("disconnect", () => {
  console.log("=== SOCKET DISCONNECTED ===");
});

socket.on("connect_error", (error) => {
  console.error("=== SOCKET CONNECT ERROR ===", error);
});

socket.on("error", (error) => {
  console.error("=== SOCKET ERROR ===", error);
});

export default socket;
