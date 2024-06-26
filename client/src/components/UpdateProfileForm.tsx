/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthContext } from "@/context/auth-provider";
import { useRef, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { IoMdCloseCircle } from "react-icons/io";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateProfileForm = () => {
  const { currentUser, setCurrentUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser || currentUser === "loading") {
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullname", currentUser.fullname);
      formData.append("username", currentUser.username);
      formData.append("bio", currentUser.bio);

      if (imageFile) {
        formData.append("file", imageFile);
      }

      if (!imageFile && currentUser.profilePic) {
        formData.append("profilePic", currentUser.profilePic);
      }

      const { data } = await axios.post(
        `/api/user/updateUser/${currentUser.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("currentUser", JSON.stringify(data.user));
      setLoading(false);
      toast.success("Profile Updated");
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
          setCurrentUser({ ...currentUser, profilePic: reader.result });
          setImageFile(file);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setCurrentUser({ ...currentUser, profilePic: "" });
    setImageFile(null);
  };

  const handleCancelChanges = () => {
    const storageData = localStorage.getItem("currentUser");
    if (storageData) {
      setCurrentUser(JSON.parse(storageData));
    }
  };

  return (
    <DialogContent className="w-full p-4">
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4">
        <form className="flex flex-col gap-6" onSubmit={handleUpdateProfile}>
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

                  <IoMdCloseCircle
                    className="text-red-500 absolute right-0 top-0 text-2xl bg-black rounded-full cursor-pointer"
                    onClick={(e) => handleRemoveImage(e)}
                  />
                </div>
              )}
            </label>
            <input
              id="pic"
              ref={fileInputRef}
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
          <div className="flex justify-between gap-4">
            <div
              className="p-2 rounded-lg bg-red-500 w-full text-center cursor-pointer"
              onClick={handleCancelChanges}
            >
              <span>Cancel changes</span>
            </div>
            <button
              type="submit"
              className="p-2 rounded-lg bg-green-500 w-full flex justify-center items-center disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <RotatingLines
                  visible={true}
                  width="25"
                  strokeWidth="5"
                  strokeColor="white"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                />
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
};

export default UpdateProfileForm;
