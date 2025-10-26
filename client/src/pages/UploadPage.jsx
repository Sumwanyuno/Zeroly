import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MapPicker from "../components/MapPicker";
import "leaflet/dist/leaflet.css";
import api from "../api"; // ✅ Use your pre-configured axios instance

const UploadPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    if (!name || !description || !category || !address) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!userInfo || !userInfo.token) {
      alert("You must be logged in to list an item.");
      navigate("/login");
      return;
    }

    setUploading(true);

    try {
      // Step 1: Upload Image
      const formData = new FormData();
      formData.append("image", image);

      const { data: uploadData } = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Step 2: Create item
      const newItem = {
        name,
        description,
        category,
        address,
        imageUrl: uploadData.imageUrl,
      };

      await api.post("/items", newItem); // ✅ Token auto-attached via interceptor

      setUploading(false);
      alert("Item created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating item:", error);
      setUploading(false);

      let errorMessage = "Failed to create item. Please try again.";
      if (error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if ([401, 403].includes(error.response.status)) {
          errorMessage = "Authentication required. Please log in again.";
          navigate("/login");
        } else {
          errorMessage = `Server responded with status ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = "Network error: Could not connect to server.";
      } else {
        errorMessage = `Unexpected error: ${error.message}`;
      }

      alert(`Submission Error: ${errorMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 font-sans">
      <div className="w-full max-w-2xl p-10 space-y-8 bg-white rounded-2xl shadow-2xl border border-emerald-300">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-emerald-700 mb-6 drop-shadow-md">
          <span
            role="img"
            aria-label="upload"
            className="mr-3 text-4xl md:text-5xl"
          >
            📤
          </span>
          List a New Item
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Give your unused items a new purpose and contribute to a greener
          community!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="itemName"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Item Name
            </label>
            <input
              id="itemName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Vintage Lamp, Gently Used Backpack"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the item..."
              required
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 resize-y"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Category
            </label>
            <input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Furniture, Electronics, Books"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Address / Pickup Location
            </label>
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address or select on map"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500"
            />
            <p className="text-sm text-gray-600 mt-2">
              Or click on the map to select a location:
            </p>
            <MapPicker
              onPick={(selectedAddress) => setAddress(selectedAddress)}
            />
          </div>
          <div>
            <label
              htmlFor="imageUpload"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Upload Image
            </label>
            <input
              id="imageUpload"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              required
              className="w-full file:mr-4 file:py-2 file:px-5 file:rounded-full file:bg-emerald-600 file:text-white file:cursor-pointer"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "List Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
