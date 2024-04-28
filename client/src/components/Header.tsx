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
      className={`w-full flex items-center ${
        currentUser ? "justify-between" : "justify-center"
      } py-4 mb-16 lg:mb-20`}
    >
      {currentUser && (
        <Link to="/">
          <IoMdHome className="text-3xl sm:text-4xl" />
        </Link>
      )}
      <img
        src={`${theme === "dark" ? "/icon-dark.svg" : "/icon-light.svg"}`}
        alt="logo"
        className="w-12 h-12 cursor-pointer self-center"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      {currentUser && <UserProfile />}
    </div>
  );
};

export default Header;
