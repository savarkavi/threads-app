import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import { useTheme } from "./context/theme-provider";
import UserPage from "./pages/UserPage";
import UserPostPage from "./pages/UserPostPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

function App() {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full min-h-screen px-6 ${
        theme === "dark" ? "dark bg-zinc-950" : "bg-white"
      }`}
    >
      <div className="max-w-[768px] mx-auto bg-white dark:bg-zinc-950">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:postId" element={<UserPostPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
