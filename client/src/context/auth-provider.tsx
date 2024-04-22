/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

type ContextTypes = {
  currentUser: UserObject | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserObject | null>>;
};

type UserObject = {
  fullname: string;
  username: string;
  email: string;
  id: string;
};

const AuthContext = createContext<ContextTypes | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState<UserObject | null>(null);

  useEffect(() => {
    const storageUser = localStorage.getItem("currentUser");

    if (storageUser) {
      setCurrentUser(JSON.parse(storageUser));
    } else {
      setCurrentUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};