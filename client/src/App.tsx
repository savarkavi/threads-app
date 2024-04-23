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
      className={`w-full min-h-screen px-6 ${
        theme === "dark" ? "dark bg-zinc-950" : "bg-white"
      }`}
    >
      <div className="max-w-[768px] mx-auto bg-white dark:bg-zinc-950">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              currentUser ? <HomePage /> : <Navigate to="/auth/signin" />
            }
          />
          <Route
            path="/auth/signup"
            element={!currentUser ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/auth/signin"
            element={!currentUser ? <SignIn /> : <Navigate to="/" />}
          />
          <Route
            path="/:username"
            element={
              currentUser ? <UserPage /> : <Navigate to="/auth/signin" />
            }
          />
          <Route
            path="/:username/post/:postId"
            element={
              currentUser ? <UserPostPage /> : <Navigate to="/auth/signin" />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
