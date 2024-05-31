import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import { useTheme } from "./context/theme-provider";
import UserPage from "./pages/UserPage";
import UserPostPage from "./pages/UserPostPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import { useAuthContext } from "./context/auth-provider";
import ChatSidebar, { ConversationType } from "./components/ChatSidebar";
import { useState } from "react";

export type IsMessageRead = {
  userId: string;
  isRead: boolean;
};

function App() {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const { currentUser } = useAuthContext();
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(true);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);

  return (
    <div
      className={`w-full min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#121212] to-[#000000]"
          : "bg-white"
      } ${pathname.includes("/chat") && "flex"}`}
    >
      {!pathname.includes("/chat") ? (
        <LeftSidebar />
      ) : (
        <ChatSidebar
          isChatSidebarOpen={isChatSidebarOpen}
          setIsChatSidebarOpen={setIsChatSidebarOpen}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      )}
      <div
        className={`flex w-full ${
          currentUser ? "justify-end" : "justify-center"
        } ${!pathname.includes("/chat") && "max-w-[1440px] mx-auto"}`}
      >
        <div
          className={`w-full flex flex-col justify-between ${
            !pathname.includes("/chat") &&
            "max-w-[640px] 2xl:max-w-[768px] mx-auto xl:mx-0"
          } ${
            !pathname.includes("/auth") &&
            "border-x bg-white dark:bg-zinc-950 shadow-lg"
          }`}
        >
          <Header
            isChatSidebarOpen={isChatSidebarOpen}
            setIsChatSidebarOpen={setIsChatSidebarOpen}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:username" element={<UserPage />} />
            <Route path="/:username/post/:postId" element={<UserPostPage />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/signin" element={<SignIn />} />
          </Routes>
        </div>
        {currentUser === null ||
        currentUser === "loading" ||
        pathname.includes("/chat") ? null : (
          <RightSidebar />
        )}
      </div>
    </div>
  );
}

export default App;
