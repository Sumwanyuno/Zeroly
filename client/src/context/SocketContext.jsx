// client/src/context/SocketContext.jsx
import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);

  const socket = useMemo(() => {
    if (!userInfo?.token) return null;
    return io("http://localhost:5001", {
      transports: ["websocket"],
      auth: { token: userInfo.token }, // <-- IMPORTANT
    });
  }, [userInfo?.token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
