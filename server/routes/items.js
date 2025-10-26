// server/routes/items.js

import express from "express";
import {
  createItem,
  getItems,
  getItemById,
  deleteItem,
  getItemReviews,
  addItemReview,
  deleteItemReview,
} from "../controllers/itemController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ import multer middleware

const router = express.Router();

// ✅ use upload.single("image") so req.file is populated
router
  .route("/")
  .get(getItems)
  .post(protect, upload.single("image"), createItem);

router.route("/:id").get(getItemById).delete(protect, deleteItem);

router.route("/:id/reviews").get(getItemReviews).post(protect, addItemReview);

router.route("/:itemId/reviews/:reviewId").delete(protect, deleteItemReview);

export default router;
