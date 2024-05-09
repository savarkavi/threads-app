/* eslint-disable @typescript-eslint/no-explicit-any */
import { IsMessageRead } from "@/App";
import { useAuthContext } from "@/context/auth-provider";
import { useConversationsContext } from "@/context/conversations-provider";
import { useSocketContext } from "@/context/socket-provider";
import { UserDataType } from "@/utils/types";
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
  isMessageRead,
  setIsMessageRead,
}: {
  isChatSidebarOpen: boolean;
  setIsChatSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedConversation: ConversationType | null;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
  isMessageRead: IsMessageRead[] | null;
  setIsMessageRead: React.Dispatch<
    React.SetStateAction<IsMessageRead[] | null>
  >;
}) => {
  const { conversations } = useConversationsContext();
  const { currentUser } = useAuthContext();
  const { onlineUsers } = useSocketContext();

  if (!currentUser || currentUser === "loading") return null;

  console.log(conversations);

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
        {!conversations ? (
          <div>laoding...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {conversations.map((conversation: ConversationType) => {
              const lastMessage =
                conversation.messages[conversation.messages.length - 1].message;
              const reciever = conversation.participants.find(
                (user) => user._id !== currentUser.id
              );
              return (
                <div
                  key={conversation._id}
                  className={`${
                    selectedConversation?._id === conversation._id &&
                    "bg-gray-300 dark:bg-zinc-800 rounded-lg"
                  } flex items-center gap-4 hover:bg-gray-300 dark:hover:bg-zinc-800 hover:rounded-lg py-2 cursor-pointer border-b transition-all`}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    setIsChatSidebarOpen(false);
                  }}
                >
                  <img
                    src={
                      reciever?.profilePic
                        ? reciever?.profilePic
                        : "/profile.png"
                    }
                    alt="profile pic"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <h2 className="font-semibold">{reciever?.username}</h2>
                      {onlineUsers.find(
                        (userId) => userId === reciever?._id
                      ) && (
                        <span className="text-sm w-2 h-2 rounded-full bg-green-500"></span>
                      )}
                    </div>
                    <p className="text-sm dark:text-gray-400">
                      {lastMessage.length < 18
                        ? lastMessage
                        : lastMessage.substring(0, 18) + "..."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
