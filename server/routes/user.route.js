import express from "express";
import authorize from "../middlewares/authorize.js";
import {
  followUser,
  getConversationUsers,
  getPopularUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/followUser/:id", authorize, followUser);
router.post("/updateUser/:id", authorize, upload.single("file"), updateUser);
router.get("/getUser/:username", authorize, getUser);
router.get("/getPopularUsers", authorize, getPopularUsers);
router.get("/getConversationUsers", authorize, getConversationUsers);

export default router;
