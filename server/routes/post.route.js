import express from "express";
import {
  createPost,
  createReply,
  deletePost,
  getFollowingPosts,
  getLatestPosts,
  getPost,
  getUserPosts,
  likePost,
} from "../controllers/post.controller.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/create", authorize, upload.single("file"), createPost);
router.post(
  "/createReply/:postId",
  authorize,
  upload.single("file"),
  createReply
);
router.get("/:postId", authorize, getPost);
router.delete("/:postId", authorize, deletePost);
router.post("/like/:postId", authorize, likePost);
router.get("/getPosts/latestPosts", authorize, getLatestPosts);
router.get("/getPosts/followingPosts", authorize, getFollowingPosts);
router.get("/getPosts/userPosts/:username", authorize, getUserPosts);

export default router;
