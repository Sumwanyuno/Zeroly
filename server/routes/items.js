
import express from "express";
import {
    createItem,
    getItems,
    getItemById,
    deleteItem,
    getItemReviews,
    addItemReview,
    deleteItemReview, // <--- CRUCIAL: Import the deleteItemReview function
} from "../controllers/itemController.js";

import { protect } from "../middleware/authMiddleware.js"; // Ensure this path is correct

const router = express.Router();

// Routes for /api/items (GET all, POST new)
router.route("/").post(protect, createItem).get(getItems);

// Routes for /api/items/:id (GET single, DELETE)
router.route("/:id").get(getItemById).delete(protect, deleteItem);

// Routes for /api/items/:id/reviews (GET reviews, POST new review)
router
    .route("/:id/reviews")
    .get(getItemReviews)
    .post(protect, addItemReview);

// --- CRUCIAL ROUTE FOR DELETING A SPECIFIC REVIEW ---
// DELETE /api/items/:itemId/reviews/:reviewId
// This route is what handles the DELETE request from your frontend.
router.route("/:itemId/reviews/:reviewId").delete(protect, deleteItemReview);


export default router;