// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import itemRoutes from './routes/items.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/uploadRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

const PORT = process.env.PORT || 5001;

// ---- Connect DB ----
await connectDB();

// ---- Initialize Express ----
const app = express();

// ---- CORS ----
const allowedOrigins = [
  process.env.CLIENT_URL || 'https://zeroly.netlify.app',
  'http://localhost:5173',
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

app.use(cors(corsOptions));
app.use(express.json());

// ---- Routes ----
app.get('/', (req, res) => res.send('API is running'));
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ---- Socket.IO ----
const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: [
      "http://localhost:5173",
      "https://zeroly.netlify.app",
      "https://zeroly-production.up.railway.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('send-message', (data) => io.emit('new-message', data));
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
