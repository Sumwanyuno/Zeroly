// server/controllers/userController.js
import User from "../models/User.js";
import Item from "../models/Item.js";
import jwt from "jsonwebtoken";

// Function to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
export const registerUser = async (req, res) => {
  // --- Start of Debugging Logs ---
  console.log('--- "Register User" endpoint hit ---');
  console.log("Request Body:", req.body);
  // --- End of Debugging Logs ---

  try {
    const { name, email, password } = req.body;

    // Check if all data was received
    if (!name || !email || !password) {
      console.log("Validation failed: Missing name, email, or password.");
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log("User already exists in database.");
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      console.log("User created successfully in database.");
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // This case is unlikely but we'll log it anyway
      console.log("User creation failed for an unknown reason.");
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // This will catch any error during the process
    console.error("---!! SERVER ERROR DURING REGISTRATION !!---");
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // req.user is added by the protect middleware, so we know who is logged in
    const user = await User.findById(req.user._id);

    if (user) {
      // Find all items in the database created by this specific user
      const items = await Item.find({ user: req.user._id });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        items: items, // Return the user's items along with their profile
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
