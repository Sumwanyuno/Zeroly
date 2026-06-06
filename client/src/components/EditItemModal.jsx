import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "../api.js";

const EditItemModal = ({ isOpen, onClose, item, onEditSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    address: "",
    ecoSeeds: 10,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        category: item.category || "",
        address: item.address || "",
        ecoSeeds: item.ecoSeeds || 10,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item) return;

    setLoading(true);
    try {
      const { data } = await api.put(`/api/items/${item._id}`, formData);
      toast.success("Item updated successfully!");
      onEditSuccess(data); // Pass back the updated item
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error(error.response?.data?.message || "Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="edit-item-description">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
          <DialogDescription id="edit-item-description">
            Make changes to your item. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Vintage Chair"
              required
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the condition and details"
              required
              aria-required="true"
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              aria-required="true"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Toys">Toys</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Location</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="City, Area"
                required
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecoSeeds">EcoSeeds</Label>
              <Input
                id="ecoSeeds"
                name="ecoSeeds"
                type="number"
                min="1"
                max="50"
                value={formData.ecoSeeds}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onClose(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemModal;
