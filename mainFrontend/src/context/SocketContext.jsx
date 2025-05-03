import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    const shouldReconnect =
      authUser?.token &&
      authUser?._id &&
      (!socket || socket.disconnected || socket.auth?.token !== authUser.token);


    if (!shouldReconnect) return;

    console.log("AuthUser available, connecting socket...");

    const socketInstance = io("http://localhost:5001/", {
      auth: {
        token: authUser.token,
      },
      query: {
        userId: authUser._id,
      },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    socketInstance.on("getOnlineUsers", (users) => {
      console.log("📡 Received online users:", users);
      setOnlineUser(users);
    });

    setSocket(socketInstance);

    return () => {
      console.log("🔌 Cleaning up socket...");
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [authUser?.token, authUser?._id]);


  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
