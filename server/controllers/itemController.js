import Item from "../models/Item.js";

// @desc    Get a single item by ID
// @route   GET /api/items/:id
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
  try {
    const { name, description, category, imageUrl, address } = req.body;

    const item = new Item({
      name,
      description,
      category,
      imageUrl,
      address,
      user: req.user._id,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating item", error: error.message });
  }
};

// @desc    Fetch all items (with search by keyword)
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
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Debug logs to check ownership
    console.log("Item Owner ID:", item.user.toString());
    console.log("Logged User ID:", req.user._id.toString());

    // Check if the logged-in user is the owner
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await item.deleteOne();
    res.json({ message: "Item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
};



// -------------------------------
// NEW: Review Controllers
// -------------------------------

// @desc    Get all reviews for a specific item
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

// @desc    Add a review to a specific item
// @route   POST /api/items/:id/reviews
// @access  Private
export const addItemReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    // Prevent the owner from reviewing their own item
    if (item.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot review your own item" });
    }

    const alreadyReviewed = item.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this item" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name || "Anonymous",
      rating: Number(rating),
      comment,
    };

    item.reviews.push(review);
    item.calcRating(); // Update numReviews & averageRating
    await item.save();

    res.status(201).json({ message: "Review added", reviews: item.reviews });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to add review" });
  }
};




