/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoMdHome, IoIosSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/auth-provider";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import UpdateProfileForm from "./UpdateProfileForm";
import axios from "axios";
import toast from "react-hot-toast";

const LeftSidebar = () => {
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
    <div className="hidden fixed dark:bg-black w-[300px] h-screen border xl:flex flex-col gap-20 shadow-lg text-center p-8">
      <h1 className="text-3xl uppercase">Social</h1>
      <div className="flex flex-col items-start gap-16">
        <div className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all">
          <IoMdHome />
          <Link to="/">Home</Link>
        </div>
        <div className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all">
          <CgProfile />
          <Link to={`/${currentUser.username}`}>Profile</Link>
        </div>
        <div className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all">
          <IoIosSettings />
          <Dialog>
            <DialogTrigger>
              <span>Settings</span>
            </DialogTrigger>
            <UpdateProfileForm />
          </Dialog>
        </div>
        <div className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all">
          <IoChatbubbleEllipsesSharp />
          <span>Messages</span>
        </div>
        <div
          className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all"
          onClick={handleLogout}
        >
          <CiLogout />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
