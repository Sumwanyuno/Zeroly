import "dotenv/config"; // Keep dotenv config for environment variables
import express from "express";
import cors from "cors";
import http from "http"; // For Socket.IO server
import { Server } from "socket.io"; // For Socket.IO

import connectDB from "./config/db.js";

import itemRoutes from "./routes/items.js";
import userRoutes from "./routes/users.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // Keep for chat functionality
import leaderboardRoutes from "./routes/leaderboardRoutes.js"; // Keep for leaderboard functionality

const PORT = process.env.PORT || 5001;

// --- CORS Setup ---
const allowedOrigins = [
  "http://localhost:5173", // Your frontend development server
  "https://zeroly.netlify.app", // Example deployed frontend URL
  "https://zeroly-production.up.railway.app", // Example deployed frontend URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log(`Blocked by CORS: ${origin}`);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

// ---- Connect DB ----
await connectDB(); // Connect to MongoDB
const app = express();
app.use(cors(corsOptions));
app.use(express.json()); // For parsing JSON request bodies

// ---- Routes ----
app.get("/", (req, res) => res.send("API is running")); // Basic API health check
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/chat", chatRoutes); // Keep chat routes
app.use("/api/leaderboard", leaderboardRoutes); // Keep leaderboard routes

// ---- Socket.IO Setup ----
const server = http.createServer(app); // Create an HTTP server for Express and Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Allow specified origins for Socket.IO
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Example: Listen for 'send-message' and emit 'new-message'
  socket.on("send-message", (data) => {
    console.log("Message received:", data);
    io.emit("new-message", data); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start the server (listening on the HTTP server, not just the Express app)
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
