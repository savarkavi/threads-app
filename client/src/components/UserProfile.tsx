/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuthContext } from "@/context/auth-provider";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import UpdateProfileForm from "./UpdateProfileForm";

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useAuthContext();
  const navigate = useNavigate();

  if (!currentUser || currentUser === "loading") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/signout");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      toast.success("You have been logged out");
      navigate("/auth/signin");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex gap-6 items-center flex-shrink-0">
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex justify-end items-center">
              <img
                src={`${
                  currentUser.profilePic
                    ? currentUser.profilePic
                    : "/profile.png"
                }`}
                className="w-8 h-8 rounded-full sm:w-10 sm:h-10 object-cover"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link to={`/${currentUser.username}`} className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DialogTrigger className="w-full">
              <DropdownMenuItem className="w-full cursor-pointer">
                Settings
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpdateProfileForm />
      </Dialog>
      <IoChatbubbleEllipsesSharp className="text-2xl sm:text-3xl" />
    </div>
  );
};

export default UserProfile;
