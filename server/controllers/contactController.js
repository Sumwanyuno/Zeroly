import Contact from "../models/Contact.js";
import logger from "../utils/logger.js";

/**
 * Submit a contact form message
 * POST /api/contact
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please provide all required fields: name, email, and message.",
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        message: "Message must be at least 10 characters long.",
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        message: "Message must not exceed 5000 characters.",
      });
    }

    // Create and save the contact message
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: "received",
    });

    const savedContact = await contact.save();

    logger.info(
      { contactId: savedContact._id, email },
      "Contact message received from %s",
      name
    );

    res.status(201).json({
      message: "Thank you for your message! The Zeroly team will get back to you soon.",
      contactId: savedContact._id,
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to submit contact form");
    res.status(500).json({
      message: "Failed to submit your message. Please try again later.",
    });
  }
};

/**
 * Get all contact messages (admin only)
 * GET /api/contact
 */
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to fetch contact messages");
    res.status(500).json({
      message: "Failed to fetch contact messages.",
    });
  }
};

/**
 * Get a single contact message by ID
 * GET /api/contact/:id
 */
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found.",
      });
    }

    // Mark as read if not already
    if (contact.status === "received") {
      contact.status = "read";
      await contact.save();
    }

    res.json(contact);
  } catch (error) {
    logger.error({ err: error }, "Failed to fetch contact message");
    res.status(500).json({
      message: "Failed to fetch contact message.",
    });
  }
};

/**
 * Update contact message status (admin only)
 * PUT /api/contact/:id
 */
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["received", "read", "resolved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: received, read, resolved.",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found.",
      });
    }

    logger.info(
      { contactId: contact._id, status },
      "Contact message status updated"
    );

    res.json({
      message: "Contact message status updated.",
      contact,
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to update contact message");
    res.status(500).json({
      message: "Failed to update contact message.",
    });
  }
};
