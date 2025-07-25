import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await axios.get("/api/chat/my", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setChats(data);
    };
    fetchChats();
  }, [userInfo.token]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Conversations</h1>
      {chats.length === 0 && <p>No conversations yet.</p>}
      {chats.map((chat) => (
        <Link key={chat._id} to={`/chat/${chat._id}`} className="block p-4 border rounded mb-2 bg-white">
          <p className="font-semibold">{chat.item?.name}</p>
          <p className="text-sm text-gray-600">Participants: {chat.participants.map((p) => p.name).join(", ")}</p>
        </Link>
      ))}
    </div>
  );
};

export default MessagesPage;
