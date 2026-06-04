import express from "express";
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
} from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact - Submit a new contact message (public)
router.post("/", submitContact);

// GET /api/contact - Get all contact messages (admin only - can be protected later)
router.get("/", getAllContacts);

// GET /api/contact/:id - Get a single contact message by ID
router.get("/:id", getContactById);

// PUT /api/contact/:id - Update contact message status
router.put("/:id", updateContactStatus);

export default router;
