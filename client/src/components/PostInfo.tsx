/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlOptions } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { PostDataType } from "@/utils/types";
import { format } from "date-fns/format";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/auth-provider";
import PostForm from "./PostForm";
import { Link } from "react-router-dom";

const PostInfo = ({
  postPage,
  comment,
  post,
  allPosts,
  setPostsData,
  setPostData,
}: {
  postPage?: boolean;
  comment?: boolean;
  postId?: string;
  post: PostDataType;
  allPosts?: PostDataType[];
  setPostsData?: React.Dispatch<React.SetStateAction<PostDataType[] | null>>;
  setPostData?: React.Dispatch<React.SetStateAction<PostDataType | null>>;
}) => {
  const { currentUser } = useAuthContext();

  if (!currentUser || currentUser === "loading") return null;

  const handlePostLike = async (
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    try {
      const { data } = await axios.post(`/api/posts/like/${post._id}`);
      if (allPosts && setPostsData) {
        const updatedAllPosts = allPosts.map((el) =>
          el._id === post._id ? { ...el, likes: data.updatedPost.likes } : el
        );
        setPostsData(updatedAllPosts);
      }

      if (setPostData) {
        setPostData({ ...post, likes: data.updatedPost.likes });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className={`w-full flex flex-col gap-6 ${
        (comment && "border-y border-gray-300 dark:border-gray-500 p-6") ||
        (postPage && "p-4 bg-zinc-950")
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`${(postPage || comment) && "flex gap-4 items-center"}`}
        >
          {(postPage || comment) && (
            <img
              src={
                post.postedBy.profilePic
                  ? post.postedBy.profilePic
                  : "/profile.png"
              }
              alt="profile photo"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <h2 className="text-lg sm:text-xl font-semibold">
            {post.postedBy.username}
          </h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>{format(post.createdAt, "MMM d")}</span>
          <SlOptions />
        </div>
      </div>
      <div className={`w-full ${!post.image && "min-h-[60px]"} flex flex-col`}>
        <p className="max-w-[250px] sm:max-w-[500px] break-words">
          {post.text}
        </p>
        {post.image && (
          <img
            src={post.image}
            alt="post image"
            className={`rounded-lg mt-3 ${
              comment
                ? "w-full max-w-[500px] max-h-[400px]"
                : "w-full max-h-[500px] "
            } object-cover`}
          />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6 text-xl sm:text-2xl">
          {post.likes.includes(currentUser.id) ? (
            <FaHeart
              onClick={handlePostLike}
              className="text-red-500 cursor-pointer"
            />
          ) : (
            <FaRegHeart onClick={handlePostLike} className="cursor-pointer" />
          )}
          <div>
            <PostForm
              comment
              postId={post._id}
              setPostsData={setPostsData}
              setPostData={setPostData}
            />
          </div>
          <CiShare2 />
          <IoIosSend />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Link to={`/${post.postedBy.username}/post/${post._id}`}>{`${
            post.replies.length === 0 ? 0 : post.replies.length
          } replies`}</Link>
          <span className="w-1 h-1 rounded-full bg-gray-500"></span>
          <p>{`${post.likes.length === 0 ? 0 : post.likes.length} likes`}</p>
        </div>
      </div>
    </div>
  );
};

export default PostInfo;
