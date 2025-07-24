// server/controllers/itemController.js

import Item from "../models/Item.js";
import User from "../models/User.js"; // Import the User model
// Removed: import asyncHandler from 'express-async-handler';

// @desc    Create a new item
// @route   POST /api/items
export const createItem = async (req, res) => {
  // Removed asyncHandler wrapper
  try {
    const { name, description, category, imageUrl, address } = req.body;

    // Basic validation (you might want to add more comprehensive checks)
    if (!name || !description || !category || !imageUrl || !address) {
      res
        .status(400)
        .json({
          message:
            "Please include all required fields: name, description, category, imageUrl, and address.",
        });
      return; // Added return to stop execution
    }

    const item = new Item({
      name,
      description,
      category,
      imageUrl,
      address,
      user: req.user._id, // User ID from auth middleware
    });

    const createdItem = await item.save();

    // Award 1 point to the user who uploaded the item
    const user = await User.findById(req.user._id);
    if (user) {
      user.points = (user.points || 0) + 1; // Ensure points is a number, default to 0
      await user.save();
      console.log(
        `User ${user.username} awarded 1 point for uploading an item.`
      );
    } else {
      console.warn(`User with ID ${req.user._id} not found after item upload.`);
    }

    res.status(201).json(createdItem);
  } catch (error) {
    console.error("Error creating item:", error.message);
    res
      .status(500)
      .json({ message: "Error creating item", error: error.message }); // Send error response
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
export const getItemById = async (req, res) => {
  // Removed asyncHandler wrapper
  try {
    const item = await Item.findById(req.params.id).populate(
      "user",
      "username email phone address points"
    ); // Populate user points too
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" }); // Send error response
    }
  } catch (error) {
    console.error("Error fetching item by ID:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message }); // Send error response
  }
};

// @desc    Fetch all items
// @route   GET /api/items
export const getItems = async (req, res) => {
  // Removed asyncHandler wrapper
  try {
    const keyword = req.query.keyword
      ? {
          // Search in both name and category fields
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { category: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {}; // If no keyword, the object is empty and finds all items

    const items = await Item.find({ ...keyword })
      .sort({ createdAt: -1 })
      .populate("user", "username points"); // Populate user points for items list
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).json({ message: "Error fetching items: " + error.message }); // Send error response
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
export const deleteItem = async (req, res) => {
  // Removed asyncHandler wrapper
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      // Optional: Logic to deduct points if an item is deleted,
      // but typically points are awarded for the act of uploading, not for keeping it listed.
      // If you want to deduct, you'd add similar logic as in createItem but with user.points - 1

      await item.deleteOne();
      res.json({ message: "Item removed" });
    } else {
      res.status(404).json({ message: "Item not found" }); // Send error response
    }
  } catch (error) {
    console.error("Error deleting item:", error.message);
    res.status(500).json({ message: "Error deleting item: " + error.message }); // Send error response
  }
};

// You might also want to add a getMyItems function if you don't have it already
// @desc    Get items by user
// @route   GET /api/items/myitems
// @access  Private
export const getMyItems = async (req, res) => {
  // Removed asyncHandler wrapper
  try {
    const items = await Item.find({ user: req.user._id }).populate(
      "user",
      "username points"
    );
    res.json(items);
  } catch (error) {
    console.error("Error fetching my items:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching my items: " + error.message }); // Send error response
  }
};
