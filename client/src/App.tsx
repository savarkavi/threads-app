import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import { useTheme } from "./context/theme-provider";
import UserPage from "./pages/UserPage";
import UserPostPage from "./pages/UserPostPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { useAuthContext } from "./context/auth-provider";

function App() {
  const { theme } = useTheme();
  const { currentUser } = useAuthContext();

  return (
    <div
      className={`w-full min-h-screen ${
        theme === "dark" ? "dark bg-zinc-950" : "bg-white"
      }`}
    >
      <div className="max-w-[768px] mx-auto px-6 bg-white dark:bg-zinc-950">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/auth/signup"
            element={!currentUser ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/auth/signin"
            element={!currentUser ? <SignIn /> : <Navigate to="/" />}
          />
          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:postId" element={<UserPostPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
