import PostInfo from "./PostInfo";
import { PostDataType } from "@/utils/types";

const UserPost = ({
  post,
  allPosts,
  setPostsData,
}: {
  post: PostDataType;
  allPosts: PostDataType[];
  setPostsData: React.Dispatch<React.SetStateAction<PostDataType[] | null>>;
}) => {
  return (
    <div className="flex gap-4 sm:gap-8 w-full p-6 border-b bg-zinc-950">
      <div className="flex flex-col justify-between flex-shrink-0">
        <div className="flex flex-col items-center h-full self-start">
          <img
            src={
              post.postedBy.profilePic
                ? post.postedBy.profilePic
                : "/profile.png"
            }
            alt="profile photo"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
          />
          <div className="w-[1px] bg-black dark:bg-white h-full"></div>
        </div>
        <div className="flex flex-col w-full gap-2 items-center self-start">
          <div className="flex items-center gap-2">
            <img
              src="/robot.jpg"
              alt="profile photo"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
            />
            <img
              src="/placeholder.jpg"
              alt="profile photo"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
            />
          </div>
          <img
            src="/bochan.jpeg"
            alt="profile photo"
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
          />
        </div>
      </div>

      <PostInfo post={post} allPosts={allPosts} setPostsData={setPostsData} />
    </div>
  );
};

export default UserPost;
