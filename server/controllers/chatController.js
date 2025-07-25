// import Chat from "../models/Chat.js";
// import Message from "../models/Message.js";


// server/controllers/chatController.js
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Item from "../models/Item.js";

export const startChat = async (req, res) => {
  try {
    const { itemId } = req.body;
    const existing = await Chat.findOne({ item: itemId, users: req.user._id });

    if (existing) return res.json(existing);

    const chat = new Chat({
      item: itemId,
      users: [req.user._id],
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Failed to start chat" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const message = new Message({
      chat: req.params.chatId,
      text,
      sender: req.user._id,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
};
