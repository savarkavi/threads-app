/* eslint-disable @typescript-eslint/no-explicit-any */
import Comments from "@/components/Comments";
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
        setPostData(data);
      };

      fetchPost();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }, [postId]);

  console.log(postData);

  if (!postData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <PostInfo
        postPage
        post={postData}
        setPostData={setPostData}
        postId={postId}
      />
      {/* <Comments /> */}
    </div>
  );
};

export default UserPostPage;
