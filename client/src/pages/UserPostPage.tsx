/* eslint-disable @typescript-eslint/no-explicit-any */
import PostInfo from "@/components/PostInfo";
import { PostDataType } from "@/utils/types";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const UserPostPage = () => {
  const { postId } = useParams();
  const [postData, setPostData] = useState<PostDataType | null>(null);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const { data } = await axios.get(`/api/posts/${postId}`);
        data.replies.reverse();
        setPostData(data);
      };

      fetchPost();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }, [postId]);

  if (!postData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <PostInfo
        postPage
        post={postData}
        setPostData={setPostData}
        postId={postId}
      />
      <div className="mt-16">
        <h2 className="text-3xl font-semibold px-6">{`${
          postData.replies.length
        } ${postData.replies.length === 1 ? "Comment" : "Comments"}`}</h2>
        <div className="mt-6">
          {postData.replies.map((reply) => {
            return (
              <div key={reply._id}>
                <PostInfo post={reply} comment setPostData={setPostData} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserPostPage;
