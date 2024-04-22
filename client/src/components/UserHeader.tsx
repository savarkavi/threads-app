import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const UserHeader = () => {
  const handleCopyLink = () => {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
      toast.success("Profile link copied");
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl sm:text-4xl font-semibold">Sushant Sharma</h1>
          <h2 className="sm:text-xl mt-2">{`@sushant`}</h2>
        </div>
        <img
          src="/sushant-img.jpg"
          alt="profile photo"
          className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="w-full">
          <p className="sm:text-lg">The greatest to ever do it, yo.</p>
          <div className="flex justify-between mt-2 w-full">
            <div className="flex gap-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              <p>3.2k followers</p>
              <Link to="#">instagram.com</Link>
            </div>
            <div className="flex gap-4 text-2xl">
              <FaInstagram />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <SlOptions className="border border-black dark:border-white rounded-full p-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-none bg-zinc-900 p-0">
                  <DropdownMenuItem
                    className="bg-white dark:bg-zinc-900 p-3 flex justify-center"
                    onClick={handleCopyLink}
                  >
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-b border-gray-400 dark:border-gray-500 flex">
        <div className="p-3 w-full text-center cursor-pointer border-b border-black dark:border-white">
          Posts
        </div>
        <div className="p-3 w-full text-center cursor-pointer">Replies</div>
      </div>
    </div>
  );
};

export default UserHeader;
