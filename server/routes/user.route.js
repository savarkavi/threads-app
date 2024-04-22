import express from "express";
import authorize from "../middlewares/authorize.js";
import {
  followUser,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/followUser/:id", authorize, followUser);
router.post("/updateUser/:id", authorize, updateUser);
router.get("/getUser/:username", getUser);

export default router;
