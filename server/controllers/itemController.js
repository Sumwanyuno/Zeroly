// server/controllers/itemController.js

import cloudinary from "../config/cloudinary.js";
import Item from "../models/Item.js";
import User from "../models/User.js";

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new item
// @route   POST /api/items
// @access  Private (requires auth + file upload)
export const createItem = async (req, res) => {
  try {
    const { name, description, category, address } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "zeroly",
      resource_type: "image",
    });

    const item = new Item({
      name,
      description,
      category,
      imageUrl: result.secure_url, // ✅ real Cloudinary URL
      address,
      user: req.user._id,
    });

    const createdItem = await item.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    if (user) {
      user.itemCount += 1;
      user.points += 1;
      await user.save();
    }

    res.status(201).json(createdItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res
      .status(500)
      .json({ message: "Error creating item", error: error.message });
  }
};

// @desc    Get all items (optionally filtered by keyword)
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { category: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const items = await Item.find({ ...keyword }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (item owner only)
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this item" });
    }

    // Update user stats
    const user = await User.findById(item.user);
    if (user) {
      user.itemCount = Math.max(0, user.itemCount - 1);
      user.points = Math.max(0, user.points - 1);
      await user.save();
    }

    await item.deleteOne();
    res.json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res
      .status(500)
      .json({ message: "Error deleting item", error: error.message });
  }
};

// @desc    Get item reviews
// @route   GET /api/items/:id/reviews
// @access  Public
export const getItemReviews = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).select(
      "reviews numReviews averageRating"
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({
      reviews: item.reviews,
      numReviews: item.numReviews,
      averageRating: item.averageRating,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// @desc    Add a review
// @route   POST /api/items/:id/reviews
// @access  Private
export const addItemReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.user.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot review your own item" });
    }

    const alreadyReviewed = item.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this item" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name || "Anonymous",
      rating: Number(rating),
      comment,
    };

    item.reviews.push(review);
    item.calcRating();
    await item.save();

    res.status(201).json({
      message: "Review added",
      reviews: item.reviews,
      averageRating: item.averageRating,
      numReviews: item.numReviews,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ message: "Failed to add review", error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/items/:itemId/reviews/:reviewId
// @access  Private (item owner or review author)
export const deleteItemReview = async (req, res) => {
  try {
    const { itemId, reviewId } = req.params;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const review = item.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const isItemOwner = item.user.toString() === req.user._id.toString();
    const isReviewAuthor = review.user.toString() === req.user._id.toString();

    if (!isItemOwner && !isReviewAuthor) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this review" });
    }

    review.deleteOne();

    item.calcRating();
    await item.save();

    res.status(200).json({
      message: "Review deleted successfully",
      averageRating: item.averageRating,
      numReviews: item.numReviews,
    });
  } catch (error) {
    console.error(
      `Error deleting review for item ${req.params.itemId} and review ${req.params.reviewId}:`,
      error
    );
    res.status(500).json({
      message: "Server error while deleting review",
      error: error.message,
    });
  }
};
