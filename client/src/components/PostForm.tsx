/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import toast from "react-hot-toast";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";

const PostForm = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [textContent, setTextContent] = useState("");
  const [remainingChar, setRemainingChar] = useState(300);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          setImagePreview(reader.result);
          setImageFile(file);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
  };

  const handleTextContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value.length > 300) {
      const truncateText = textContent.slice(0, 300);
      setTextContent(truncateText);
      setRemainingChar(0);
      return;
    }

    setRemainingChar(300 - e.target.value.length);
    setTextContent(e.target.value);
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", textContent);

      if (imageFile) {
        formData.append("file", imageFile);
      }

      const { data } = await axios.post(`/api/posts/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(data);
      setLoading(false);
      setTextContent("");
      setImagePreview("");
      setImageFile(null);
      setRemainingChar(300);
      toast.success("Post created!");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="fixed right-4 bottom-8 2xl:right-10 2xl:bottom-14 text-white bg-zinc-800 p-4 lg:py-2 lg:px-6 rounded-full lg:rounded-lg flex items-center gap-2 z-[99]">
          <FaPlus className="text-xl" />
          <span className="hidden lg:block text-white lg:text-lg">Post</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handlePostSubmit}>
          <div>
            <textarea
              placeholder="write your post here..."
              className="w-full h-[250px] rounded-lg p-6 bg-transparent border-2"
              value={textContent}
              onChange={(e) => handleTextContentChange(e)}
            />
          </div>
          <div>
            <div
              className={`mt-3 flex ${
                imagePreview ? "justify-end" : "justify-between"
              } w-full`}
            >
              {!imagePreview && (
                <MdAddPhotoAlternate
                  className="text-3xl cursor-pointer"
                  onClick={() => {
                    imageInputRef?.current?.click();
                  }}
                />
              )}
              <div className="flex gap-2">
                <span
                  className={`${
                    remainingChar > 50
                      ? "text-green-500"
                      : remainingChar > 10
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {remainingChar}
                </span>
                <p>/ 300</p>
              </div>
            </div>

            <input
              hidden
              id="postPic"
              type="file"
              ref={imageInputRef}
              onChange={(e) => handleImageChange(e)}
            />
            <div className="mt-3 relative">
              <img
                src={imagePreview}
                className="rounded-lg max-h-[400px] w-full object-cover"
              />
              {imagePreview && (
                <IoMdCloseCircle
                  className="absolute right-2 top-2 w-8 h-8 text-red-500 cursor-pointer"
                  onClick={handleRemoveImage}
                />
              )}
            </div>
          </div>
          <button
            className="bg-blue-500 p-2 rounded-lg w-full mt-4 disabled:cursor-not-allowed flex justify-center items-center"
            disabled={!textContent}
          >
            {loading ? (
              <RotatingLines
                visible={true}
                width="25"
                strokeWidth="5"
                strokeColor="white"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            ) : (
              "Post"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostForm;
