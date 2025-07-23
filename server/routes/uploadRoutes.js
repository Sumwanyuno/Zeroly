// server/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "zeroly",
    format: async (req, file) => "jpg", // supports promises as well
    public_id: (req, file) => file.originalname,
  },
});

const parser = multer({ storage: storage });

// This route will handle the upload and return the image URL
router.post("/", protect, parser.single("image"), (req, res) => {
  res.status(201).json({
    message: "Image uploaded successfully",
    imageUrl: req.file.path,
  });
});

export default router;
