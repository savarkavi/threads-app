/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/context/auth-provider";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useAuthContext();
  const [isImageSelected, setImageSelected] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleLogout = async () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    await axios.post("/api/auth/signout");
    toast.success("You have been logged out");
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `/api/user/updateUser/${currentUser.id}`,
        {
          fullname: currentUser.fullname,
          username: currentUser.username,
          bio: currentUser.bio,
          profilePic: currentUser.profilePic,
        }
      );

      localStorage.setItem("currentUser", JSON.stringify(data.user));
      toast.success("Profile Updated");

      console.log(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          console.log(reader.result);

          setCurrentUser({ ...currentUser, profilePic: reader.result });
        }
      };

      reader.readAsDataURL(file);
    }

    setImageSelected(true);
  };

  return (
    <div className="flex gap-6 items-center">
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex justify-end items-center">
              <img src="/profile.png" className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger>
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="w-full p-4">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <form
              className="flex flex-col gap-6"
              onSubmit={handleUpdateProfile}
            >
              <div className="flex justify-between gap-4 items-center">
                <label htmlFor="pic" className="flex-shrink-0">
                  {!currentUser.profilePic ? (
                    <div className="flex justify-start -ml-3">
                      <img
                        src="/profile.png"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={currentUser.profilePic}
                        className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover"
                      />
                      {isImageSelected && (
                        <IoMdCloseCircle className="text-red-500 absolute right-0 top-0 text-2xl bg-black rounded-full" />
                      )}
                    </div>
                  )}
                </label>
                <input
                  id="pic"
                  type="file"
                  accept="image/*"
                  className="sm:file:mr-6 border p-3 rounded-lg"
                  onChange={(e) => handleImageChange(e)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="fullname" className="text-lg">
                  Full Name
                </label>
                <input
                  id="fullname"
                  value={currentUser?.fullname}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, fullname: e.target.value })
                  }
                  className="p-2 rounded-lg bg-transparent border-2 w-full"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="username" className="text-lg">
                  Username
                </label>
                <input
                  id="username"
                  value={currentUser?.username}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, username: e.target.value })
                  }
                  className="p-2 rounded-lg bg-transparent border-2 w-full"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="bio" className="text-lg">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={currentUser?.bio}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, bio: e.target.value })
                  }
                  className="p-2 rounded-lg bg-transparent border-2 w-full h-28"
                />
              </div>
              <button className="p-2 rounded-lg bg-green-500">Save</button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <IoChatbubbleEllipsesSharp className="text-2xl sm:text-3xl" />
    </div>
  );
};

export default UserProfile;
