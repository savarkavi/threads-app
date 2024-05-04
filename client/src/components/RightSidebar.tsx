/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserDataType } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<UserDataType[] | null>(
    null
  );

  useEffect(() => {
    const fetchPopularUsers = async () => {
      try {
        const { data } = await axios.get("/api/user/getPopularUsers");
        setSuggestedUsers(data);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };

    fetchPopularUsers();
  }, []);

  if (!suggestedUsers) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hidden xl:block h-[500px] p-8">
      <h2 className="text-2xl">Suggested Users</h2>
      {suggestedUsers.length === 0 && (
        <div className="mt-8">You are following everybody!</div>
      )}
      <div className="mt-8 flex flex-col gap-8">
        {suggestedUsers.map((user: UserDataType) => {
          return (
            <div key={user._id} className="flex gap-8 w-full items-center">
              <img
                src={user.profilePic}
                alt="profile pic"
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col gap-1 text-sm w-full">
                <div>{user.username}</div>
                <span className="text-gray-500">{user.fullname}</span>
              </div>
              <Link
                to={`/${user.username}`}
                className="py-2 px-3 rounded-lg bg-blue-600 text-sm"
              >
                View
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RightSidebar;
