// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { initSocket } from "../socket.js";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  useEffect(() => {
    if (userInfo?.token) {
      try {
        const socketInstance = initSocket(userInfo.token);
        setSocket(socketInstance);

        socketInstance.on("connect", () => {
          console.log("Socket connected:", socketInstance.id);
        });

        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });

        socketInstance.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
          if (reason === 'io server disconnect') {
            socketInstance.connect();
          }
        });

        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        setSocket(null);
      }
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token]);

  const login = (data) => {
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};
