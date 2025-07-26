// server/routes/requestRoutes.js
import express from "express";
// Make sure to import the new function
import {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createRequest);
router.route("/sent").get(protect, getSentRequests);
router.route("/received").get(protect, getReceivedRequests);

// This new route handles updating a request by its ID
router.route("/:id").put(protect, updateRequestStatus);

export default router;
