import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.get("/:recieverId", authorize, getMessages);
router.post("/send/:recieverId", authorize, sendMessage);

export default router;
