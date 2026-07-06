// client/src/context/SocketContext.jsx
// DEPRECATED: Socket functionality has been moved to AuthContext
// This file is kept for reference but should not be used
// Use AuthContext instead for socket access

import { createContext, useContext } from "react";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  // Delegate to AuthContext socket
  const { socket } = useContext(AuthContext);
  
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
