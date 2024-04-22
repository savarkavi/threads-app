import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  likePost,
  replyPost,
} from "../controllers/post.controller.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.post("/create", authorize, createPost);
router.get("/:postId", getPost);
router.delete("/:postId", authorize, deletePost);
router.post("/like/:postId", authorize, likePost);
router.post("/reply/:postId", authorize, replyPost);

export default router;
