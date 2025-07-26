// server/routes/chatRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { startChat, getMessages, sendMessage } from "../controllers/chatController.js";

const router = express.Router();


router.post("/start", protect, startChat);


router.get("/:chatId/messages", protect, getMessages);


router.post("/:chatId/messages", protect, sendMessage);

export default router;