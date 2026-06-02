// client/src/context/SocketContext.jsx
import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  const socket = io((import.meta.env.VITE_SOCKET_URL, {
  auth: { token: userInfo?.token },
})

   [userInfo?.token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
