/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "@/context/auth-provider";
import { UserDataType } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

export type MessageType = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  reciever: UserDataType;
  sender: UserDataType;
  message: string;
};

export type ConversationType = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageType[];
  participants: UserDataType[];
};

const ChatSidebar = ({
  isChatSidebarOpen,
  setIsChatSidebarOpen,
  selectedConversation,
  setSelectedConversation,
}: {
  isChatSidebarOpen: boolean;
  setIsChatSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedConversation: ConversationType | null;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
}) => {
  const [conversations, setConversations] = useState<ConversationType[] | null>(
    null
  );

  const { currentUser } = useAuthContext();

  useEffect(() => {
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
  }, []);

  if (!currentUser || currentUser === "loading") return null;

  if (!conversations) return null;

  return (
    <div
      className={`${
        isChatSidebarOpen ? "left-0" : "-left-[100%]"
      } fixed lg:static z-[99] min-h-screen p-8 w-full dark:bg-zinc-950 lg:w-[400px] transition-all duration-300 border-r`}
    >
      <MdKeyboardDoubleArrowLeft
        className="absolute right-4 top-4 text-3xl lg:hidden"
        onClick={() => setIsChatSidebarOpen(false)}
      />
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl">Your Conversations</h1>
        <form className="flex gap-2 items-center">
          <input
            placeholder="search a user"
            className="border p-2 rounded-lg bg-gray-300 dark:bg-zinc-800"
          />
          <div className="bg-gray-300 dark:bg-zinc-800 p-2 rounded-lg">
            <CiSearch className="text-2xl" />
          </div>
        </form>
        <hr />
        <div className="">
          {conversations.map((conversation: ConversationType) => {
            const reciever = conversation.participants.find(
              (user) => user._id !== currentUser.id
            );
            return (
              <div
                key={conversation._id}
                className={`${
                  selectedConversation?._id === conversation._id &&
                  "bg-zinc-800 rounded-lg"
                } flex items-center gap-4 hover:bg-zinc-800 hover:rounded-lg py-2 cursor-pointer border-b transition-all`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <img
                  src={
                    reciever?.profilePic ? reciever?.profilePic : "/profile.png"
                  }
                  alt="profile pic"
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold">{reciever?.username}</h2>
                  <p className="text-sm text-gray-400">
                    {conversation.messages[0].message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
