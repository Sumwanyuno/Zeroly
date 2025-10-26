import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get("/chat/my");
        setChats(data);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
        alert("Error loading conversations. Please try again.");
      }
    };

    if (userInfo?.token) {
      fetchChats();
    }
  }, [userInfo]);

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Your Conversations
      </h1>

      {chats.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        chats.map((chat) => (
          <Link
            key={chat._id}
            to={`/chat/${chat._id}`}
            className="block p-4 border border-green-200 rounded-lg mb-4 bg-white hover:shadow-md transition"
          >
            <p className="text-lg font-semibold text-gray-800">
              {chat.item?.name || "Unnamed Item"}
            </p>
            <p className="text-sm text-gray-600">
              Participants: {chat.participants.map((p) => p.name).join(", ")}
            </p>
          </Link>
        ))
      )}
    </div>
  );
};

export default MessagesPage;
