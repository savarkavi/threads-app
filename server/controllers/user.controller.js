import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

export const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const userToFollow = await User.findById(id);

    if (id === currentUserId.toString())
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself" });

    if (!userToFollow)
      return res.status(400).json({ message: "User not found" });

    const isFollowing = userToFollow.followers?.includes(currentUserId);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });
      return res.status(200).json({ message: "User unfollowed successfully!" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $push: { following: id } });
      return res.status(200).json({ message: "User followed successfully!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullname, username, bio } = req.body;
    const imagePath = req.file?.path;
    let imageUrl = "";

    const userId = req.user._id;

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ message: "You cannot update other user's profile." });

    const user = await User.findById(userId);

    if (imagePath) {
      const uploadRes = await cloudinary.uploader.upload(imagePath);
      imageUrl = uploadRes.secure_url;
      await fs.unlink(imagePath);
    }

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.profilePic = imageUrl ? imageUrl : "";
    user.bio = bio || user.bio;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        id: updatedUser._id,
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password -__v");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getPopularUsers = async (req, res) => {
  const userId = req.user._id;

  try {
    const users = await User.find({
      followers: { $nin: userId },
      _id: { $ne: userId },
    })
      .sort({ "followers.length": -1 })
      .limit(5)
      .select("-password -__v");

    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getConversationUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      participants: { $in: userId },
    })
      .populate({ path: "participants", select: "-password -__v" })
      .populate({
        path: "messages",
        select: "-__v",
        populate: { path: "sender", select: "-password -__v" },
      })
      .select("-__v");

    res.status(200).json(conversations);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
