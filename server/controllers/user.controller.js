import User from "../models/user.model.js";

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
    const { fullname, username, profilePic, bio } = req.body;

    const userId = req.user._id;

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ message: "You cannot update other user's profile." });

    const user = await User.findByIdAndUpdate(userId);

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully!",
      user: {
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

    const user = await User.findOne({ username })
      .select("-password")
      .select("-__v");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
