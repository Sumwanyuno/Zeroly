import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Make sure path is correct
import { useContext } from "react";

const ChatPage = () => {
  const { chatId } = useParams();
  const { userInfo } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!chatId || !userInfo?.token) {
          console.warn("Missing chatId or user token");
          return;
        }

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/${chatId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setMessages(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch messages");
      }
    };

    fetchMessages();
  }, [chatId, userInfo]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/${chatId}/messages`,
        {
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Please log in to view this chat.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-gray-100 rounded p-3 shadow-sm text-sm"
            >
              <p className="font-semibold">{msg.sender?.name || "Unknown"}:</p>
              <p>{msg.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 mt-6">
        <input
          type="text"
          className="flex-grow border rounded p-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
