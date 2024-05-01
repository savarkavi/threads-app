import { IoMdHome, IoIosSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoAddCircle } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";

const LeftSidebar = () => {
  return (
    <div className="fixed bg-black w-[300px] h-screen border flex flex-col gap-20 text-center p-8">
      <h1 className="text-3xl uppercase">Social</h1>
      <div className="flex flex-col items-start gap-16">
        <div className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all">
          <IoMdHome />
          <span>Home</span>
        </div>
        <div className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all">
          <CgProfile />
          <span>Profile</span>
        </div>
        <div className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all">
          <IoIosSettings />
          <span>Settings</span>
        </div>
        <div className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all">
          <IoAddCircle />
          <span>Post</span>
        </div>
        <div className="flex gap-3 items-center text-xl cursor-pointer hover:text-blue-600 transition-all">
          <CiLogout />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
