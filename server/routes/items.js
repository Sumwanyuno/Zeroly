// server/routes/items.js
import express from "express";
import {
    createItem,
    getItems,
    getItemById,
    deleteItem,
} from "../controllers/itemController.js";

import { protect } from "../middleware/authMiddleware.js";
import { getItemReviews, addItemReview } from "../controllers/itemController.js";

const router = express.Router();

router.route("/").post(protect, createItem).get(getItems);
router.route("/:id").get(getItemById).delete(protect, deleteItem);
router
    .route("/:id/reviews")
    .get(getItemReviews)
    .post(protect, addItemReview);

export default router;