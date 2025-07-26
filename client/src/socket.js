import { io } from "socket.io-client";

// Use Railway backend URL or fallback to localhost for dev
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export const initSocket = (token) =>
  io(SOCKET_URL, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket"], // Prefer websocket over polling
  });

  