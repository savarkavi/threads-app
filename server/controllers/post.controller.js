import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    const postedBy = req.user._id;

    if (!text) return res.status(400).json({ message: "Invalid text input" });

    const newPost = await new Post({ postedBy, text, image }).save();
    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== userId.toString())
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this post" });

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLikedByUser = post.likes.includes(userId);

    if (isLikedByUser) {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
      return res.status(200).json({ message: "Post unliked", updatedPost });
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $push: { likes: userId },
        },
        { new: true }
      );
      return res.status(200).json({ message: "Post liked", updatedPost });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const replyPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, image } = req.body;
    const postedBy = req.user._id;

    if (!text) return res.status(400).json({ message: "Invalid text input" });
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const newReply = await new Post({
      postedBy,
      text,
      image,
      isReply: true,
    }).save();

    post.replies.push(newReply._id);
    const updatedPost = await post.save();

    res.status(201).json({ message: "Reply sent", updatedPost });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
