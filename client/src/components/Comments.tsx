import { useEffect } from "react";
import PostInfo from "./PostInfo";

const Comments = () => {
  useEffect(() => {});

  return (
    <div className="flex flex-col gap-6">
      <PostInfo comment />
    </div>
  );
};

export default Comments;
