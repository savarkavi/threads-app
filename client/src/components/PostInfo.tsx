/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaRegHeart, FaHeart, FaTrash } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { PostDataType } from "@/utils/types";
import { format } from "date-fns/format";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/auth-provider";
import PostForm from "./PostForm";
import { Link, useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PostInfo = ({
  postPage,
  comment,
  post,
  parentPost,
  allPosts,
  setPostsData,
  setPostData,
}: {
  postPage?: boolean;
  comment?: boolean;
  postId?: string;
  post: PostDataType;
  parentPost?: PostDataType;
  allPosts?: PostDataType[];
  setPostsData?: React.Dispatch<React.SetStateAction<PostDataType[] | null>>;
  setPostData?: React.Dispatch<React.SetStateAction<PostDataType | null>>;
}) => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  if (!currentUser || currentUser === "loading") return null;

  const handlePostLike = async (
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`/api/posts/like/${post._id}`);
      if (allPosts && setPostsData) {
        const updatedAllPosts = allPosts.map((el) =>
          el._id === post._id ? { ...el, likes: data.updatedPost.likes } : el
        );
        return setPostsData(updatedAllPosts);
      }

      if (parentPost && setPostData) {
        const updatedReplies = parentPost.replies.map((reply: PostDataType) =>
          reply._id === post._id
            ? { ...reply, likes: data.updatedPost.likes }
            : reply
        );
        return setPostData({ ...parentPost, replies: updatedReplies });
      }

      if (setPostData) {
        return setPostData({ ...post, likes: data.updatedPost.likes });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      const { data } = await axios.delete(`/api/posts/${post._id}`);
      if (setPostsData && allPosts) {
        const updatedPosts = allPosts.filter(
          (post: PostDataType) => post._id !== data.deletedPost._id
        );

        setPostsData(updatedPosts);
      }

      if (setPostData && comment && parentPost) {
        const updatedReplies = parentPost.replies.filter(
          (reply: PostDataType) => reply._id !== post._id
        );
        setPostData({ ...parentPost, replies: updatedReplies });
        return;
      }

      if (setPostData) {
        navigate("/");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className={`w-full flex flex-col gap-6 ${
        (comment &&
          "border-y border-gray-300 dark:border-gray-500 px-6 py-8") ||
        (postPage && "px-6 dark:bg-zinc-950 mt-20")
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
          <Link
            to={`/${post.postedBy.username}`}
            className="text-lg sm:text-xl font-semibold"
          >
            {post.postedBy.username}
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>{format(post.createdAt, "MMM d")}</span>
          {post.postedBy._id === currentUser.id && (
            <AlertDialog>
              <AlertDialogTrigger>
                <FaTrash className="cursor-pointer" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePost}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
