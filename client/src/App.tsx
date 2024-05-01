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

function App() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  return (
    <div
      className={`w-full min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#121212] to-[#000000]"
          : "bg-white"
      }`}
    >
      <LeftSidebar />
      <div
        className={`max-w-[768px] mx-auto ${
          !pathname.includes("/auth") &&
          "border-x bg-white dark:bg-zinc-950 shadow-lg"
        }`}
      >
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:postId" element={<UserPostPage />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/signin" element={<SignIn />} />
        </Routes>
      </div>
      <RightSidebar />
    </div>
  );
}

export default App;
