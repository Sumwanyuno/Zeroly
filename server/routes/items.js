// server/routes/items.js
import express from "express";
import {
  createItem,
  getItems,
  deleteItem,
  getItemById,
} from "../controllers/itemController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createItem).get(getItems);
router.route("/:id").get(getItemById).delete(protect, deleteItem);

export default router;
