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
  const [latestPostsData, setLatestPostsData] = useState<PostDataType[] | null>(
    null
  );
  const [followingPostsData, setFollowingPostsData] = useState<
    PostDataType[] | null
  >(null);
  const [isLatestPost, setIsLatestPost] = useState(true);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const { data } = await axios.get("/api/posts/getPosts/latestPosts");
        setLatestPostsData(data);
      };

      fetchPosts();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }, []);

  const handleFetchFollowingPosts = async () => {
    setIsLatestPost(false);

    try {
      const fetchPosts = async () => {
        const { data } = await axios.get("/api/posts/getPosts/followingPosts");
        setFollowingPostsData(data);
      };

      fetchPosts();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  if (!currentUser) {
    return <Navigate to="/auth/signin" />;
  }

  if (!latestPostsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <PostForm setPostsData={setLatestPostsData} />

      <div className="w-full border-gray-400 dark:border-gray-500 px-6 mb-6 mt-20">
        <div className="border-b border-gray-400 dark:border-gray-500 flex">
          <div
            className={`p-3 w-full text-center cursor-pointer ${
              isLatestPost && "border-b border-black dark:border-white"
            }`}
            onClick={() => setIsLatestPost(true)}
          >
            Latest Posts
          </div>
          <div
            className={`p-3 w-full text-center cursor-pointer ${
              !isLatestPost && "border-b border-black dark:border-white"
            }`}
            onClick={handleFetchFollowingPosts}
          >
            Following
          </div>
        </div>
      </div>
      {isLatestPost ? (
        <div>
          {latestPostsData.map((post: PostDataType) => {
            return (
              <UserPost
                key={post._id}
                post={post}
                allPosts={latestPostsData}
                setPostsData={setLatestPostsData}
              />
            );
          })}
        </div>
      ) : (
        <div>
          {followingPostsData?.length === 0 ? (
            <div className="flex justify-center mt-16 text-xl">
              You are not following anyone
            </div>
          ) : (
            followingPostsData?.map((post: PostDataType) => {
              return (
                <UserPost
                  key={post._id}
                  post={post}
                  allPosts={followingPostsData}
                  setPostsData={setFollowingPostsData}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
