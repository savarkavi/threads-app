import { useTheme } from "../context/theme-provider";
import { IoMdHome } from "react-icons/io";
import { useAuthContext } from "@/context/auth-provider";
import UserProfile from "./UserProfile";
import { Link } from "react-router-dom";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { currentUser } = useAuthContext();

  return (
    <div
      className={`w-full flex items-center relative ${
        currentUser ? "justify-between p-6" : "justify-center p-10"
      }`}
    >
      {currentUser && (
        <Link to="/">
          <IoMdHome className="text-3xl sm:text-4xl" />
        </Link>
      )}
      <div className="absolute left-1/2 -translate-x-1/2">
        <img
          src={`${theme === "dark" ? "/icon-dark.svg" : "/icon-light.svg"}`}
          alt="logo"
          className="w-12 h-12 cursor-pointer self-center"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      </div>
      {currentUser && <UserProfile />}
    </div>
  );
};

export default Header;
