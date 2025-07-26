// client/src/socket.js
import { io } from "socket.io-client";

// Use Railway backend in production, localhost in dev
const SOCKET_URL =
  import.meta.env.PROD
    ? "https://zeroly-production.up.railway.app"  // <-- Railway backend
    : "http://localhost:5001";

export const initSocket = (token) =>
  io(SOCKET_URL, {
    path: "/socket.io",
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"], // fallback to polling if needed
  });
