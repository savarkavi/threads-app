/* eslint-disable @typescript-eslint/no-explicit-any */
import PostForm from "@/components/PostForm";
import UserPost from "@/components/UserPost";
import { useAuthContext } from "@/context/auth-provider";
import { PostDataType } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const { currentUser } = useAuthContext();
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const { data } = await axios.get("/api/posts/getPosts/latestPosts");
        console.log(data);
        setPostData(data);
      };

      fetchPosts();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }, []);

  if (!currentUser) {
    return <Navigate to="/auth/signin" />;
  }

  return (
    <div>
      <div className="w-full border-b border-gray-400 dark:border-gray-500 flex">
        <div className="p-3 w-full text-center cursor-pointer border-b border-black dark:border-white">
          Latest Posts
        </div>
        <div className="p-3 w-full text-center cursor-pointer">Following</div>
      </div>
      <div>
        {postData.map((post: PostDataType) => {
          return <UserPost key={post._id} post={post} />;
        })}
      </div>
      <PostForm />
    </div>
  );
};

export default HomePage;
