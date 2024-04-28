/* eslint-disable @typescript-eslint/no-explicit-any */
import UserHeader from "@/components/UserHeader";
import UserPost from "@/components/UserPost";
import { useAuthContext } from "@/context/auth-provider";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
import { PostDataType, UserDataType } from "@/utils/types";

const UserPage = () => {
  const { username } = useParams();
  const { currentUser } = useAuthContext();
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [userPosts, setUserPosts] = useState<PostDataType[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`/api/user/getUser/${username}`);
        setUserData(data);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const { data } = await axios.get(
          `/api/posts/getPosts/userPosts/${username}`
        );
        setUserPosts(data);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [username]);

  if (!currentUser) {
    return <Navigate to="/auth/signin" />;
  }

  if (!userData || !userPosts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dark:text-white">
      <UserHeader userData={userData} setUserData={setUserData} />
      <div>
        {userPosts.map((post: PostDataType) => {
          return (
            <UserPost
              key={post._id}
              post={post}
              allPosts={userPosts}
              setPostsData={setUserPosts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UserPage;
