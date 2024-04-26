export type UserDataType = {
  _id: string;
  fullname: string;
  username: string;
  bio: string;
  email: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
  followers: string[];
  following: string[];
};

export type PostDataType = {
  _id: string;
  text: string;
  image: string;
  createdAt: string;
  isReply: boolean;
  postedBy: UserDataType;
  likes: string[];
  replies: string[];
};
