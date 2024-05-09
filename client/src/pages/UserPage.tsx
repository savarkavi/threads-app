/* eslint-disable @typescript-eslint/no-explicit-any */
import UserHeader from "@/components/UserHeader";
import UserPost from "@/components/UserPost";
import { useAuthContext } from "@/context/auth-provider";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
import { PostDataType, UserDataType } from "@/utils/types";
import { RotatingLines } from "react-loader-spinner";

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
    return (
      <div className="min-h-screen flex justify-center mt-20">
        <RotatingLines
          visible={true}
          width="50"
          strokeWidth="5"
          strokeColor="white"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  return (
    <div className="dark:text-white min-h-screen">
      <UserHeader
        userData={userData}
        setUserData={setUserData}
        setUserPosts={setUserPosts}
      />
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
