// server/routes/contactRoutes.js
import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  console.log("New contact message:", { name, email, message });

  // You can later connect this to a database, or send email using Nodemailer
  res
    .status(200)
    .json({ success: true, message: "Thank you for contacting us!" });
});

export default router;
