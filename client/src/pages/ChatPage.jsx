import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const { chatId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // fetch existing messages
  useEffect(() => {
    const fetchMsgs = async () => {
      const { data } = await axios.get(`/api/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setMessages(data);
    };
    fetchMsgs();
  }, [chatId, userInfo.token]);

  // listen socket
  useEffect(() => {
    if (!socket) return;
    socket.emit("joinRoom", chatId);

    const handler = (msg) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("new-message", handler);
    return () => {
      socket.off("new-message", handler);
    };
  }, [socket, chatId]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // save to DB
    const { data } = await axios.post(
      `/api/chat/${chatId}/messages`,
      { text },
      { headers: { Authorization: `Bearer ${userInfo.token}` } }
    );

    // emit to room
    socket?.emit("send-message", {
      roomId: chatId,
      chatId,
      text: data.text,
      sender: userInfo._id,
      createdAt: data.createdAt,
    });

    setText("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="border p-4 h-96 overflow-y-auto mb-4 bg-white">
        {messages.map((m) => (
          <div key={m._id || Math.random()} className="mb-2">
          <strong>{m.sender?.name || (m.sender === userInfo._id ? "You" : "Other")}:</strong> {m.text}
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
        <button className="bg-blue-600 text-white rounded px-4">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
