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
    <div className="flex gap-4 sm:gap-8 w-full px-6 py-10 border-b border-gray-400 bg-white dark:bg-zinc-950">
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
        {post.replies.length > 0 && (
          <div className="flex flex-col w-full gap-2 items-center self-start">
            <div className="flex items-center gap-2">
              <img
                src={
                  post.replies[0].postedBy?.profilePic
                    ? post.replies[0].postedBy?.profilePic
                    : "/profile.png"
                }
                alt="profile photo"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
              />
              {post.replies[1] && (
                <img
                  src={
                    post.replies[1].postedBy?.profilePic
                      ? post.replies[1].postedBy?.profilePic
                      : "/profile.png"
                  }
                  alt="profile photo"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                />
              )}
            </div>
            {post.replies[2] && (
              <img
                src={
                  post.replies[2].postedBy.profilePic
                    ? post.replies[2].postedBy.profilePic
                    : "/profile.png"
                }
                alt="profile photo"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
              />
            )}
          </div>
        )}
      </div>

      <PostInfo post={post} allPosts={allPosts} setPostsData={setPostsData} />
    </div>
  );
};

export default UserPost;
