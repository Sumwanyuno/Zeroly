import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../api.js";

const ChatPage = () => {
  const { chatId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const socket = useSocket();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // --------------------------
  // 1. Fetch existing messages
  // --------------------------
  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const { data } = await api.get(`/api/chat/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setMessages(data);
        console.log("Fetched messages:", data);
      } catch (error) {
        console.error("Failed to fetch chat messages:", error);
      }
    };
    fetchMsgs();
  }, [chatId, userInfo.token]);

  // --------------------------
  // 2. Listen to socket events
  // --------------------------
  useEffect(() => {
    if (!socket) return;

    console.log("Joining room:", chatId);
    socket.emit("joinRoom", chatId);

    const handler = (msg) => {
      console.log("Received new message:", msg);
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("new-message", handler);
    return () => socket.off("new-message", handler);
  }, [socket, chatId]);

  // --------------------------
  // 3. Send message
  // --------------------------
  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      // Save to DB
      const { data } = await axios.post(
        `/api/chat/${chatId}/messages`,
        { text },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      console.log("Message saved to DB:", data);

      // Emit socket event
      socket?.emit("send-message", {
        roomId: chatId, // Must match the room ID
        chatId,
        text: data.text,
        sender: userInfo._id,
        createdAt: data.createdAt,
      });

      setMessages((prev) => [...prev, data]); // Optimistic UI
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Message failed to send. Check server logs.");
    }
  };

  // --------------------------
  // 4. UI
  // --------------------------
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="border p-4 h-96 overflow-y-auto mb-4 bg-white">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
        {messages.map((m) => (
          <div key={m._id || Math.random()} className="mb-2">
            <strong>
              {m.sender?.name || (m.sender === userInfo._id ? "You" : "Other")}:
            </strong>{" "}
            {m.text}
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
