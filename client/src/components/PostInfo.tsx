import { SlOptions } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";

const PostInfo = ({
  postPage,
  comment,
}: {
  postPage?: boolean;
  comment?: boolean;
}) => {
  const handlePostActions = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <div
      className={`w-full flex-[80%] flex-shrink-0 flex flex-col gap-6 ${
        comment && "border-b border-gray-300 dark:border-gray-500 py-6"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`${(postPage || comment) && "flex gap-4 items-center"}`}
        >
          {(postPage || comment) && (
            <img
              src="/sushant-img.jpg"
              alt="profile photo"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <h2 className="text-lg sm:text-xl font-semibold">sushant</h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>1d</span>
          <SlOptions />
        </div>
      </div>
      <div>
        <p>Lets talk about me bitch.</p>
        <img
          src="/placeholder.jpg"
          alt="post image"
          className={`rounded-lg mt-3 ${
            comment
              ? "w-full max-w-[500px] max-h-[400px]"
              : "w-full max-h-[500px] "
          } object-cover`}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6 text-xl sm:text-2xl">
          <FaRegHeart onClick={handlePostActions} />
          <IoChatbubbleOutline />
          <CiShare2 />
          <IoIosSend />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <p>500 replies</p>
          <span className="w-1 h-1 rounded-full bg-gray-500"></span>
          <p>1276 likes</p>
        </div>
      </div>
    </div>
  );
};

export default PostInfo;
