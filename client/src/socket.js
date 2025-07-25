import { io } from "socket.io-client";

export const initSocket = (token) =>
  io(import.meta.env.VITE_API_BASE || "http://localhost:5000", {
    auth: { token },
    transports: ["websocket"],
  });
