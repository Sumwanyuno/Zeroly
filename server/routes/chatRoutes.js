// server/routes/chatRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { startChat, getMessages, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

// Start or get a chat
router.post("/start", protect, startChat);

// Get messages for a chat
router.get("/:chatId/messages", protect, getMessages);

// Send a message
router.post("/:chatId/messages", protect, sendMessage);

export default router;
