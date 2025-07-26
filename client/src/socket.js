import { io } from "socket.io-client";

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL;

console.log("Using SOCKET_URL:", SOCKET_URL);

const url = SOCKET_URL || "https://zeroly-production.up.railway.app";

console.log("Connecting to socket at:", url);

console.log("SOCKET URL:",
    import.meta.env.VITE_SOCKET_URL);

export const initSocket = (token) =>
    io(SOCKET_URL, {
        auth: { token },
        withCredentials: true,
        transports: ["websocket"],
    });