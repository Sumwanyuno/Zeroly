import Item from "../models/Item.js";

// @desc    Create a new item
// @route   POST /api/items
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

export const createItem = async (req, res) => {
  try {
    const { name, description, category, imageUrl, address } = req.body; // Removed 'location'

    const item = new Item({
      name,
      description,
      category,
      imageUrl,
      address, // Use simple text address
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

// @desc    Fetch all items
// @route   GET /api/items
// export const getItems = async (req, res) => {
//   try {
//     const items = await Item.find({}).sort({ createdAt: -1 });
//     res.json(items);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching items", error: error.message });
//   }
// };

export const getItems = async (req, res) => {
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
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      await item.deleteOne();
      res.json({ message: "Item removed" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting item", error: error.message });
  }
};
