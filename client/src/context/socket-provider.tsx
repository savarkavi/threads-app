/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuthContext } from "./auth-provider";

type ContextTypes = {
  socket: Socket | null;
  onlineUsers: string[];
};

const SocketContext = createContext<ContextTypes | null>(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { currentUser } = useAuthContext();

  useEffect(() => {
    const socket = io("https://threads-app-uhbt.onrender.com/", {
      query: {
        userId: currentUser !== "loading" && currentUser?.id,
      },
    });

    setSocket(socket);

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
