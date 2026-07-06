// server/controllers/chatController.js
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Item from "../models/Item.js";
import User from "../models/User.js";

export const startChat = async(req, res) => {
    try {
        const { itemId } = req.body;
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        const existing = await Chat.findOne({ item: itemId, participants: { $all: [req.user._id, item.user] } });

        if (existing) return res.json(existing);

        const chat = new Chat({
            item: itemId,
            participants: [req.user._id, item.user],
        });
        await chat.save();
        res.status(201).json(chat);
    } catch (err) {
        res.status(500).json({ message: "Failed to start chat" });
    }
};

export const getMessages = async(req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name");
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export const sendMessage = async(req, res) => {
    try {
        const { text } = req.body;

        // Perform AI Safety Moderation
        const moderationResult = await moderateChatMessage(text);
        
        if (!moderationResult.isSafe) {
            // Intercept and block the message
            // Optionally, emit a system warning to the sender directly via Socket.io
            req.app.get('io')?.to(req.user._id.toString()).emit('system_warning', {
                reason: moderationResult.reason || "Message blocked by AI Moderation Shield."
            });
            
            return res.status(400).json({ 
                message: "Message blocked by safety shield", 
                reason: moderationResult.reason 
            });
        }

        const message = new Message({
            chat: req.params.chatId,
            text,
            sender: req.user._id,
        });
        await message.save();

        const chat = await Chat.findById(req.params.chatId);
        if (chat) {
            // Speedy Responder badge logic
            const senderUser = await User.findById(req.user._id);
            if (senderUser && !senderUser.badges.includes("Speedy Responder")) {
                const oneHourInMs = 60 * 60 * 1000;
                const timeSinceChatCreation = new Date() - new Date(chat.createdAt);
                
                if (timeSinceChatCreation <= oneHourInMs) {
                    const userMessagesCount = await Message.countDocuments({
                        chat: req.params.chatId,
                        sender: req.user._id
                    });
                    
                    if (userMessagesCount === 1) {
                        senderUser.rapidResponses += 1;
                        if (senderUser.rapidResponses >= 5) {
                            senderUser.badges.push("Speedy Responder");
                        }
                        await senderUser.save();
                    }
                }
            }

            const receiverId = chat.participants.find(p => p.toString() !== req.user._id.toString());
            if (receiverId) {
                req.app.get('io')?.to(receiverId.toString()).emit('receive_message', {
                    chatId: chat._id,
                    senderName: req.user.name,
                    text: text
                });
            }
        }
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: "Failed to send message" });
    }
};

export const getMyChats = async(req, res) => {
    try {
        const chats = await Chat.find({ participants: req.user._id })
            .populate("participants", "name")
            .populate("item", "name imageUrl")
            .lean();
            
        const chatsWithLatestMessage = await Promise.all(
            chats.map(async (chat) => {
                const latestMessage = await Message.findOne({ chat: chat._id })
                    .sort({ createdAt: -1 })
                    .lean();
                return { ...chat, latestMessage };
            })
        );
        
        res.json(chatsWithLatestMessage);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch chats" });
    }
};