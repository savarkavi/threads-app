import Comments from "@/components/Comments";
import PostInfo from "@/components/PostInfo";
import { IoIosSend } from "react-icons/io";

const UserPostPage = () => {
  return (
    <div className="min-h-screen">
      <PostInfo postPage />
      <form className="w-full relative my-8">
        <input
          name="comment"
          placeholder="👋 write a comment..."
          className="bg-transparent px-3 py-6 border-y w-full"
        />
        <IoIosSend className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl" />
      </form>
      <Comments />
    </div>
  );
};

export default UserPostPage;
