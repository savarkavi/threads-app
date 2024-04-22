import UserHeader from "@/components/UserHeader";
import UserPost from "@/components/UserPost";

const UserPage = () => {
  return (
    <div className="dark:text-white">
      <UserHeader />
      <UserPost />
      <UserPost />
      <UserPost />
    </div>
  );
};

export default UserPage;
