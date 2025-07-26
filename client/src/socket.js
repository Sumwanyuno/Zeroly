import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const initSocket = (token) =>
  io(SOCKET_URL, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket"], // Avoid polling
  });
