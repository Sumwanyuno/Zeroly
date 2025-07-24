// server/controllers/userController.js
import User from "../models/User.js";
import Item from "../models/Item.js"; // Keep this import if you need to fetch items in getUserProfile
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
    const { name, email, password, phone, address } = req.body; // Added phone and address from User model

    // Check if all data was received
    if (!name || !email || !password || !phone || !address) {
      // Added phone and address to validation
      console.log(
        "Validation failed: Missing name, email, password, phone, or address."
      );
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log("User already exists in database.");
      return res.status(400).json({ message: "User already exists" });
    }

    // When a new user registers, their points will default to 0 as defined in the User model.
    const user = await User.create({ name, email, password, phone, address }); // Added phone and address to creation

    if (user) {
      console.log("User created successfully in database.");
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, // Include phone in response
        address: user.address, // Include address in response
        points: user.points, // Include points in register response
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
      phone: user.phone, // Include phone in login response
      address: user.address, // Include address in login response
      points: user.points, // Include points in login response
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
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
        phone: user.phone, // Include phone in profile response
        address: user.address, // Include address in profile response
        points: user.points, // Include points in profile response
        items: items, // Return the user's items along with their profile
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// (This function was not in your provided code, but is often part of a user controller.
//  Including a basic version for completeness and to allow profile updates.)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone; // Allow updating phone
      user.address = req.body.address || user.address; // Allow updating address

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        points: updatedUser.points, // Include points in updated profile response
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get leaderboard data
// @route   GET /api/users/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    // Fetch all users, select only 'name' and 'points' fields, and convert to plain JS objects
    const users = await User.find({}).select("name points").lean();

    // Sort users by points in descending order
    users.sort((a, b) => b.points - a.points);

    // Add rank and serial number
    const leaderboard = users.map((user, index) => ({
      serialNumber: index + 1,
      rank: index + 1, // Rank is the same as serial number here
      name: user.name, // Use 'name' as per your User model
      itemPoints: user.points,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    res.status(500).json({ message: "Server Error fetching leaderboard" });
  }
};
