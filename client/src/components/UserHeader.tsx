/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlOptions } from "react-icons/sl";
import { PostDataType, UserDataType } from "@/utils/types";
import { RotatingLines } from "react-loader-spinner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/auth-provider";

const UserHeader = ({
  userData,
  setUserData,
  setUserPosts,
}: {
  userData: UserDataType;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
  setUserPosts: React.Dispatch<React.SetStateAction<PostDataType[] | null>>;
}) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isPostsActive, setIsPostsActive] = useState<boolean>(true);

  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (currentUser && currentUser !== "loading") {
      const followed = userData.followers.includes(currentUser.id);

      if (followed) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
    }
  }, [currentUser, userData]);

  if (!currentUser || currentUser === "loading") {
    return null;
  }

  const handleCopyLink = () => {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
      toast.success("Profile link copied");
    });
  };

  const handleFollowUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/user/followUser/${userData._id}`);
      setIsFollowed((prev) => !prev);

      if (currentUser) {
        if (isFollowed) {
          const newUserFollowersData = userData.followers.filter(
            (obj) => obj !== currentUser.id
          );
          setUserData({ ...userData, followers: newUserFollowersData });
        } else {
          setUserData({
            ...userData,
            followers: [...userData.followers, currentUser.id],
          });
        }
      }
      console.log(data);
      setLoading(false);
      toast.success(
        !isFollowed
          ? `Followed ${userData.username}`
          : `Unfollowed ${userData.username}`
      );
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleFetchUserReplies = async () => {
    setIsPostsActive(false);

    try {
      const fetchReplies = async () => {
        const { data } = await axios.get(
          `/api/posts/getPosts/userReplies/${userData.username}`
        );
        setUserPosts(data);
      };

      fetchReplies();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleFetchUserPosts = async () => {
    if (isPostsActive) {
      return;
    }

    setIsPostsActive(true);

    try {
      const fetchPosts = async () => {
        const { data } = await axios.get(
          `/api/posts/getPosts/userPosts/${userData.username}`
        );
        setUserPosts(data);
      };

      fetchPosts();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex justify-between mt-20">
        <div className="flex flex-col gap-4 items-start">
          <h1 className="text-2xl sm:text-4xl font-semibold capitalize">
            {userData.fullname}
          </h1>
          <h2 className="sm:text-xl">{`@${userData.username}`}</h2>
          {userData.username !== currentUser.username && (
            <button
              className="py-2 px-6 w-[100px] text-sm rounded-lg border border-black bg-gray-200 dark:bg-zinc-800 flex justify-center items-center"
              onClick={handleFollowUser}
              disabled={loading}
            >
              {loading ? (
                <RotatingLines
                  visible={true}
                  width="20"
                  strokeWidth="5"
                  strokeColor="white"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                />
              ) : isFollowed ? (
                "unfollow"
              ) : (
                "follow"
              )}
            </button>
          )}
        </div>
        <img
          src={userData.profilePic ? userData.profilePic : "/profile.png"}
          alt="profile photo"
          className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="w-full">
          <p className="sm:text-lg">{userData.bio}</p>
          <div className="flex justify-between mt-2 w-full">
            <div className="flex gap-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              <p>{`${userData.followers.length} followers`}</p>
              <p>{`${userData.following.length} following`}</p>
            </div>
            <div className="flex gap-4 text-2xl">
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
        <div
          className={`p-3 w-full text-center cursor-pointer ${
            isPostsActive && "border-b border-black dark:border-white"
          }`}
          onClick={handleFetchUserPosts}
        >
          Posts
        </div>
        <div
          className={`p-3 w-full text-center cursor-pointer ${
            !isPostsActive && "border-b border-black dark:border-white"
          }`}
          onClick={handleFetchUserReplies}
        >
          Replies
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
