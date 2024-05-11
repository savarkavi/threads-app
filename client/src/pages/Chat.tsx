/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConversationType, MessageType } from "@/components/ChatSidebar";
import { useAuthContext } from "@/context/auth-provider";
import { IoIosSend } from "react-icons/io";
import { format } from "date-fns/format";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useConversationsContext } from "@/context/conversations-provider";
import { useSocketContext } from "@/context/socket-provider";

const Chat = ({
  selectedConversation,
  setSelectedConversation,
}: {
  selectedConversation: ConversationType | null;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const { currentUser } = useAuthContext();
  const { conversations, setConversations } = useConversationsContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { socket } = useSocketContext();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        if (conversations) {
          const updatedConversations = conversations.map((conversation) => {
            const sender = conversation.participants.find(
              (user) => user._id === message.sender._id
            );

            return !sender
              ? conversation
              : {
                  ...conversation,
                  messages: [...conversation.messages, message],
                };
          });
          setConversations(updatedConversations);
        }
        if (selectedConversation) {
          setSelectedConversation({
            ...selectedConversation,
            messages: [...selectedConversation.messages, message],
          });
        }
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [
    socket,
    setSelectedConversation,
    selectedConversation,
    conversations,
    setConversations,
  ]);

  useEffect(() => {
    if (!currentUser || currentUser == "loading") return;

    if (
      selectedConversation &&
      selectedConversation.messages[selectedConversation.messages.length - 1]
        .sender._id !== currentUser.id
    ) {
      const user = selectedConversation.participants.find(
        (user) => user._id !== currentUser.id
      );

      socket?.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: user?._id,
      });
    }

    if (selectedConversation) {
      socket?.on("messageSeen", ({ conversationId }) => {
        if (selectedConversation?._id === conversationId) {
          const updatedMessages = selectedConversation.messages.map((message) =>
            message.isSeen ? message : { ...message, isSeen: true }
          );

          setSelectedConversation({
            ...selectedConversation,
            messages: updatedMessages,
          });
        }
      });
    }
  }, [socket, currentUser, selectedConversation, setSelectedConversation]);

  if (!currentUser || currentUser === "loading") return null;

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const reciever = selectedConversation?.participants.find(
      (participant) => participant._id !== currentUser.id
    );
    try {
      const { data } = await axios.post(`/api/messages/send/${reciever?._id}`, {
        message: inputMessage,
      });

      if (selectedConversation) {
        setSelectedConversation({
          ...selectedConversation,
          messages: [...selectedConversation.messages, data.newMessage],
        });
      }

      if (conversations) {
        const updatedConversations = conversations.map((conversation) =>
          conversation._id !== selectedConversation?._id
            ? conversation
            : {
                ...conversation,
                messages: [...conversation.messages, data.newMessage],
              }
        );
        setConversations(updatedConversations);
      }

      console.log(selectedConversation);

      setInputMessage("");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="p-4 flex flex-col justify-between h-full">
      <div
        className="overflow-y-scroll h-[600px] xl:h-[700px] hideScrollbar"
        ref={scrollRef}
      >
        {!selectedConversation ? (
          <div className="flex justify-center items-center h-full text-2xl">
            Select a chat to send messages
          </div>
        ) : (
          <div>
            {selectedConversation.messages.map((message: MessageType) => {
              return (
                <div key={message._id}>
                  <div
                    className={`chat mb-6 ${
                      message.sender._id === currentUser.id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar">
                      <div className="w-12 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src={
                            message.sender.profilePic
                              ? message.sender.profilePic
                              : "/profile.png"
                          }
                        />
                      </div>
                    </div>
                    <div className="chat-header flex gap-2 items-center mb-2">
                      {message.sender.username}
                      <time className="text-xs opacity-50">
                        {format(message.createdAt, "HH:mm")}
                      </time>
                    </div>
                    <div
                      className={`chat-bubble ${
                        message.sender._id === currentUser.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-black dark:text-white dark:bg-zinc-800"
                      }`}
                    >
                      {message.message}
                    </div>
                    {message.sender._id === currentUser.id && (
                      <div className="chat-footer opacity-50">
                        {message.isSeen ? "seen" : "Delivered"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <form className="relative" onSubmit={handleSubmitForm}>
        <input
          placeholder="type your message..."
          className="px-2 py-4 w-full rounded-lg border bg-gray-300 dark:bg-zinc-800"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <IoIosSend className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl" />
      </form>
    </div>
  );
};

export default Chat;
