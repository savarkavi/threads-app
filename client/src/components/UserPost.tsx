import { Link } from "react-router-dom";
import PostInfo from "./PostInfo";

const UserPost = () => {
  return (
    <Link to="/sushant/post/1" className="flex gap-8 w-full py-6">
      <div className="flex flex-col justify-between">
        <div className="flex flex-col items-center h-full self-start">
          <img
            src="/sushant-img.jpg"
            alt="profile photo"
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
          <div className="w-[1px] bg-black dark:bg-white h-full"></div>
        </div>
        <div className="flex flex-col gap-2 items-center self-start">
          <div className="flex items-center gap-2">
            <img
              src="/robot.jpg"
              alt="profile photo"
              className="w-5 h-5 rounded-full object-cover"
            />
            <img
              src="/placeholder.jpg"
              alt="profile photo"
              className="w-5 h-5 rounded-full object-cover"
            />
          </div>
          <img
            src="/bochan.jpeg"
            alt="profile photo"
            className="w-5 h-5 rounded-full object-cover"
          />
        </div>
      </div>

      <PostInfo />
    </Link>
  );
};

export default UserPost;
