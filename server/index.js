// ✅ Updated by ChatGPT (Zeroly Dev Support ✨)
import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// --- Route Imports ---
import itemRoutes from "./routes/items.js";
import userRoutes from "./routes/users.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// --- App Setup ---
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:5173", // Local Vite Dev
  "https://zeroly.netlify.app", // Netlify Frontend
  "https://zeroly-production.up.railway.app", // (Optional) Frontend on Railway if needed
  "http://localhost:8888",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`🛑 Blocked by CORS: ${origin}`);
    return callback(new Error(`❌ Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

await connectDB(); // 🧠 MongoDB Connected

const app = express();
app.use(cors(corsOptions)); // ✅ CORS Setup
app.use(express.json()); // ✅ JSON Parsing

// --- Basic API Route ---
app.get("/", (req, res) => res.send("🟢 API is running"));

// --- API Routes ---
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/contact", contactRoutes);

// --- Socket.IO Setup ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("send-message", (data) => {
    io.emit("new-message", data);
  });

  socket.on("disconnect", () => {
    console.log("⚠️ User disconnected:", socket.id);
  });
});

// --- Server Listener ---
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
