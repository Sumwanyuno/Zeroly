// server/index.js
import express from "express";
import cors from "cors";
import http from "http"; // <-- Add this
import { Server } from "socket.io"; // <-- Add this
import jwt from "jsonwebtoken"; // <-- For auth if needed

import connectDB from "./config/db.js";
import itemRoutes from "./routes/items.js";
import userRoutes from "./routes/users.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";



connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/requests", requestRoutes);

// ---- Socket.IO Setup ----
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Optional: JWT authentication for sockets
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Only assign what exists
    socket.user = { _id: decoded.id };

    next();
  } catch (e) {
    next(new Error("Socket authentication failed"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.user?._id || socket.id);

  if (socket.user?._id) {
    socket.join(socket.user._id);
  }

  socket.on("send-message", ({ conversationId, text }) => {
    io.to(conversationId).emit("new-message", {
      user: socket.user?._id || "Anonymous",
      text,
      time: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// ---- Start the server ----
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
