import express from "express";
import {
  createPost,
  deletePost,
  getLatestPosts,
  getPost,
  likePost,
  replyPost,
} from "../controllers/post.controller.js";
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/create", authorize, upload.single("file"), createPost);
router.get("/:postId", authorize, getPost);
router.delete("/:postId", authorize, deletePost);
router.post("/like/:postId", authorize, likePost);
router.post("/reply/:postId", authorize, replyPost);
router.get("/getPosts/latestPosts", authorize, getLatestPosts);

export default router;
