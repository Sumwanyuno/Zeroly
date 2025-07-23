// server/index.js
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import itemRoutes from "./routes/items.js";
import userRoutes from "./routes/users.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/requests", requestRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
