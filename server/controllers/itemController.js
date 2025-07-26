// import Item from "../models/Item.js";

// // @desc    Get a single item by ID
// // @route   GET /api/items/:id
// export const getItemById = async(req, res) => {
//     try {
//         const item = await Item.findById(req.params.id);

//         if (item) {
//             res.json(item);
//         } else {
//             res.status(404).json({ message: "Item not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// // @desc    Create a new item
// // @route   POST /api/items
// // @access  Private
// export const createItem = async (req, res) => {
//   try {
//     const { name, description, category, imageUrl, address } = req.body;

//     const item = new Item({
//       name,
//       description,
//       category,
//       imageUrl,
//       address,
//       user: req.user._id,
//     });

//     const createdItem = await item.save();

//     // 🔥 UPDATE USER POINTS & ITEM COUNT
//     const user = await User.findById(req.user._id);
//     if (user) {
//       user.itemCount += 1;
//       user.points += 1;
//       await user.save();
//     }

//     res.status(201).json(createdItem);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating item", error: error.message });
//   }
// };

// // @desc    Fetch all items (with search by keyword)
// // @route   GET /api/items
// // @access  Public
// export const getItems = async(req, res) => {
//     try {
//         const keyword = req.query.keyword ? {
//             $or: [
//                 { name: { $regex: req.query.keyword, $options: "i" } },
//                 { category: { $regex: req.query.keyword, $options: "i" } },
//             ],
//         } : {};

//         const items = await Item.find({...keyword }).sort({ createdAt: -1 });
//         res.json(items);
//     } catch (error) {
//         res
//             .status(500)
//             .json({ message: "Error fetching items", error: error.message });
//     }
// };

// // @desc    Delete an item
// // @route   DELETE /api/items/:id
// // @access  Private

// export const deleteItem = async(req, res) => {
//     try {
//         const item = await Item.findById(req.params.id);

//         if (!item) {
//             return res.status(404).json({ message: "Item not found" });
//         }

//         // Debug logs to check ownership
//         console.log("Item Owner ID:", item.user.toString());
//         console.log("Logged User ID:", req.user._id.toString());

//         // Check if the logged-in user is the owner
//         if (item.user.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Not authorized to delete this item" });
//         }

//         await item.deleteOne();
//         res.json({ message: "Item removed successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting item", error: error.message });
//     }
// };



// // -------------------------------
// // NEW: Review Controllers
// // -------------------------------

// // @desc    Get all reviews for a specific item
// // @route   GET /api/items/:id/reviews
// // @access  Public
// export const getItemReviews = async(req, res) => {
//     try {
//         const item = await Item.findById(req.params.id).select(
//             "reviews numReviews averageRating"
//         );

//         if (!item) return res.status(404).json({ message: "Item not found" });

//         res.json({
//             reviews: item.reviews,
//             numReviews: item.numReviews,
//             averageRating: item.averageRating,
//         });
//     } catch (error) {
//         console.error("Error fetching reviews:", error);
//         res.status(500).json({ message: "Failed to fetch reviews" });
//     }
// };

// // @desc    Add a review to a specific item
// // @route   POST /api/items/:id/reviews
// // @access  Private
// export const addItemReview = async(req, res) => {
//     try {
//         const { rating, comment } = req.body;
//         const item = await Item.findById(req.params.id);

//         if (!item) return res.status(404).json({ message: "Item not found" });

//         // Prevent the owner from reviewing their own item
//         if (item.user.toString() === req.user._id.toString()) {
//             return res.status(400).json({ message: "You cannot review your own item" });
//         }

//         const alreadyReviewed = item.reviews.find(
//             (r) => r.user.toString() === req.user._id.toString()
//         );

//         if (alreadyReviewed) {
//             return res.status(400).json({ message: "You have already reviewed this item" });
//         }

//         const review = {
//             user: req.user._id,
//             name: req.user.name || "Anonymous",
//             rating: Number(rating),
//             comment,
//         };

//         item.reviews.push(review);
//         item.calcRating(); // Update numReviews & averageRating
//         await item.save();

//         res.status(201).json({ message: "Review added", reviews: item.reviews });
//     } catch (error) {
//         console.error("Error adding review:", error);
//         res.status(500).json({ message: "Failed to add review" });
//     }
// };// server/controllers/itemController.js

import Item from "../models/Item.js"; // Ensure this path is correct
import User from "../models/User.js"; // <--- CORRECTED: Import the User model


// @desc    Get a single item by ID
// @route   GET /api/items/:id
export const getItemById = async(req, res) => {
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
// @access  Private
export const createItem = async(req, res) => {
    try {
        const { name, description, category, imageUrl, address } = req.body;

        const item = new Item({
            name,
            description,
            category,
            imageUrl,
            address,
            user: req.user._id, // User ID from protect middleware
        });

        const createdItem = await item.save();

        // 🔥 UPDATE USER POINTS & ITEM COUNT
        const user = await User.findById(req.user._id); // Now User is defined and imported
        if (user) {
            user.itemCount += 1;
            user.points += 1;
            await user.save();
        }

        res.status(201).json(createdItem);
    } catch (error) {
        console.error("Error creating item:", error); // Added console.error for better debugging
        res.status(500).json({ message: "Error creating item", error: error.message });
    }
};

// @desc    Fetch all items (with search by keyword)
// @route   GET /api/items
// @access  Public
export const getItems = async(req, res) => {
    try {
        const keyword = req.query.keyword ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { category: { $regex: req.query.keyword, $options: "i" } },
            ],
        } : {};

        const items = await Item.find({...keyword }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error); // Added console.error for better debugging
        res
            .status(500)
            .json({ message: "Error fetching items", error: error.message });
    }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private

export const deleteItem = async(req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Debug logs to check ownership (from enchance branch)
        console.log("Item Owner ID:", item.user.toString());
        console.log("Logged User ID:", req.user._id.toString());

        // Check if the logged-in user is the owner
        if (item.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this item" });
        }

        // 🔥 OPTIONAL: Decrease user points/itemCount when item is deleted
        const user = await User.findById(item.user);
        if (user) {
            user.itemCount = Math.max(0, user.itemCount - 1); // Ensure it doesn't go below 0
            user.points = Math.max(0, user.points - 1); // Ensure it doesn't go below 0
            await user.save();
        }

        await item.deleteOne();
        res.json({ message: "Item removed successfully" });
    } catch (error) {
        console.error("Error deleting item:", error); // Added console.error for better debugging
        res.status(500).json({ message: "Error deleting item", error: error.message });
    }
};


// -------------------------------
// NEW: Review Controllers
// -------------------------------

// @desc    Get all reviews for a specific item
// @route   GET /api/items/:id/reviews
// @access  Public
export const getItemReviews = async(req, res) => {
    try {
        const item = await Item.findById(req.params.id).select(
            "reviews numReviews averageRating" // Select only necessary fields
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
export const addItemReview = async(req, res) => {
    try {
        const { rating, comment } = req.body;
        const item = await Item.findById(req.params.id);

        if (!item) return res.status(404).json({ message: "Item not found" });

        // Prevent the owner from reviewing their own item
        if (item.user.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot review your own item" });
        }

        // Check if the user has already reviewed this item
        const alreadyReviewed = item.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this item" });
        }

        const review = {
            user: req.user._id,
            name: req.user.name || "Anonymous", // Get user's name from req.user (set by auth middleware)
            rating: Number(rating),
            comment,
        };

        item.reviews.push(review); // Add the new review to the array
        item.calcRating(); // Recalculate ratings and counts using the model method (defined in Item.js)
        await item.save(); // Save the updated item

        res.status(201).json({
            message: "Review added",
            reviews: item.reviews, // Return updated reviews
            averageRating: item.averageRating,
            numReviews: item.numReviews
        });
    } catch (error) {
        console.error("Error adding review:", error); // Added console.error for better debugging
        res.status(500).json({ message: "Failed to add review", error: error.message });
    }
};

// @desc    Delete a review from an item
// @route   DELETE /api/items/:itemId/reviews/:reviewId
// @access  Private (Item Owner OR Review Author)
export const deleteItemReview = async(req, res) => {
    try {
        const { itemId, reviewId } = req.params;

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const review = item.reviews.id(reviewId); // Find the subdocument review by its ID

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // --- Authorization Check: Allow deletion if Item Owner OR Review Author ---
        // req.user._id should be populated by your authentication middleware
        const isItemOwner = item.user.toString() === req.user._id.toString();
        const isReviewAuthor = review.user.toString() === req.user._id.toString();

        if (!isItemOwner && !isReviewAuthor) {
            return res.status(401).json({ message: 'Not authorized to delete this review.' });
        }

        review.deleteOne(); // Remove the review subdocument from the array

        item.calcRating(); // Recalculate ratings and counts after deletion
        await item.save(); // Save the updated item

        res.status(200).json({
            message: 'Review deleted successfully',
            averageRating: item.averageRating,
            numReviews: item.numReviews
        });

    } catch (error) {
        console.error(`Error deleting review for item ${req.params.itemId} and review ${req.params.reviewId}:`, error); // Added console.error for better debugging
        res.status(500).json({ message: 'Server error while deleting review.', error: error.message });
    }
};
