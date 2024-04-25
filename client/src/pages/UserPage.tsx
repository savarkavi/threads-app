/* eslint-disable @typescript-eslint/no-explicit-any */
import UserHeader from "@/components/UserHeader";
import UserPost from "@/components/UserPost";
import { useAuthContext } from "@/context/auth-provider";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
import { UserDataType } from "@/utils/types";

const UserPage = () => {
  const { username } = useParams();
  const { currentUser } = useAuthContext();
  const [userData, setUserData] = useState<UserDataType | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`/api/user/getUser/${username}`);
        setUserData(data);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };

    fetchUserData();
  }, [username]);

  if (!currentUser) {
    return <Navigate to="/auth/signin" />;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dark:text-white">
      <UserHeader userData={userData} setUserData={setUserData} />
      <UserPost />
      <UserPost />
      <UserPost />
    </div>
  );
};

export default UserPage;
