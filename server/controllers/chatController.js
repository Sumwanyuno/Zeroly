import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Item from "../models/Item.js";

// Create or get a chat between the current user and item owner
export const startChat = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await Item.findById(itemId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    // Prevent owner chatting with themselves
    if (item.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }

    // Find if a chat already exists
    let chat = await Chat.findOne({
      item: itemId,
      participants: { $all: [req.user._id, item.user] },
    });

    if (!chat) {
      chat = new Chat({
        item: itemId,
        participants: [req.user._id, item.user],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ message: "Failed to start chat" });
  }
};

// Get all chats of the logged-in user
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("item", "name imageUrl")
      .populate("participants", "name email");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

// Get all messages for a chat
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId }).populate("sender", "name email");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      text,
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};
