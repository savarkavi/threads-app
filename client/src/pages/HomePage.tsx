import { useAuthContext } from "@/context/auth-provider";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const { currentUser } = useAuthContext();

  if (!currentUser) {
    return <Navigate to="/auth/signin" />;
  }

  return (
    <div>
      <button className="absolute right-16 bottom-16 bg-zinc-800 py-2 px-8 rounded-lg">
        Post
      </button>
    </div>
  );
};

export default HomePage;
