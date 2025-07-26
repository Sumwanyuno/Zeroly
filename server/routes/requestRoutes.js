import express from "express";
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

router.route("/:id").put(protect, updateRequestStatus);

export default router;
