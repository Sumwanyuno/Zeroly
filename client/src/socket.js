import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const url = SOCKET_URL || "https://zeroly-production.up.railway.app";

export const initSocket = (token) =>
    io(url, {
        auth: { token },
        withCredentials: true,
        transports: ["websocket"],
    });