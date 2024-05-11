/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConversationType } from "@/components/ChatSidebar";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "./auth-provider";

type ContextTypes = {
  conversations: ConversationType[] | null;
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationType[] | null>
  >;
};

const ConversationsContext = createContext<ContextTypes | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useConversationsContext = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

export const ConversationsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [conversations, setConversations] = useState<ConversationType[] | null>(
    null
  );

  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (currentUser) {
      try {
        const fetchConversationUsers = async () => {
          const { data } = await axios.get("/api/user/getConversationUsers");
          setConversations(data);
        };

        fetchConversationUsers();
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  }, [currentUser]);

  return (
    <ConversationsContext.Provider value={{ conversations, setConversations }}>
      {children}
    </ConversationsContext.Provider>
  );
};
