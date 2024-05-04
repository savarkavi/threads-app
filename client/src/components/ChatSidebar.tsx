import { CiSearch } from "react-icons/ci";

const ChatSidebar = () => {
  return (
    <div className="p-8 w-[500px]">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl">Your Conversations</h1>
        <form className="flex gap-2 items-center">
          <input
            placeholder="search a user"
            className="border p-2 rounded-lg"
          />
          <div className="bg-zinc-800 p-2 rounded-lg">
            <CiSearch className="text-2xl" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatSidebar;
