import { useTheme } from "../context/theme-provider";
import { IoMdHome } from "react-icons/io";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full justify-between flex items-center py-4 mb-16 lg:mb-20">
      <IoMdHome className="text-3xl sm:text-4xl" />
      <img
        src={`${theme === "dark" ? "/icon-dark.svg" : "/icon-light.svg"}`}
        alt="logo"
        className="w-12 h-12 cursor-pointer"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <div className="flex gap-6 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex justify-end items-center">
              <img src="profile.png" className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <IoChatbubbleEllipsesSharp className="text-2xl sm:text-3xl" />
      </div>
    </div>
  );
};

export default Header;
