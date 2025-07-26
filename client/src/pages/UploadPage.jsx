

// client/src/pages/UploadPage.jsx

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MapPicker from "../components/MapPicker"; // Ensure this path is correct and MapPicker.jsx has no syntax errors
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet CSS is imported if MapPicker uses it

// Define your API base URL here.
const API_BASE_URL = "http://localhost:5001/api";

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
      alert("Please fill in all required fields (Name, Description, Category, Address).");
      return;
    }

    // Ensure user is logged in before attempting upload
    if (!userInfo || !userInfo.token) {
        alert("You must be logged in to list an item.");
        navigate("/login"); // Redirect to login if not authenticated
        return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Use the full API_BASE_URL for the upload request
      const { data: uploadData } = await axios.post(
        `${API_BASE_URL}/upload`,
        formData,
        uploadConfig
      );

      const newItem = {
        name,
        description,
        category,
        address,
        imageUrl: uploadData.imageUrl,
      };

      const itemConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Use the full API_BASE_URL for the item creation request
      await axios.post(`${API_BASE_URL}/items`, newItem, itemConfig);

      setUploading(false);
      alert("Item created successfully!");
      navigate("/"); // Redirect to homepage after successful upload
    } catch (error) {
      console.error("Error creating item:", error);
      setUploading(false);

      let errorMessage = "Failed to create item. Please try again.";
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = "Authentication required. Please log in again.";
          navigate("/login"); // Redirect to login on 401/403
        } else {
          errorMessage = `Server responded with status: ${error.response.status} - ${error.response.statusText || "Unknown Error"}`;
        }
      } else if (error.request) {
        errorMessage = "Network error: Could not connect to the server.";
      } else {
        errorMessage = `An unexpected error occurred: ${error.message}`;
      }
      alert(`Submission Error: ${errorMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 font-sans">
      <div className="w-full max-w-2xl p-10 space-y-8 bg-white rounded-2xl shadow-2xl border border-emerald-300
                    transform transition-all duration-300 ease-in-out hover:scale-101 hover:shadow-3xl"> {/* Changed hover:scale-100 to hover:scale-101 */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-emerald-700 mb-6 drop-shadow-md">
          <span role="img" aria-label="upload" className="mr-3 text-4xl md:text-5xl">📤</span>
          List a New Item
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Give your unused items a new purpose and contribute to a greener community!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div>
            <label htmlFor="itemName" className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
            <input
              id="itemName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Vintage Lamp, Gently Used Backpack"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the item: its condition, dimensions, what it can be used for, etc."
              required
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200 text-gray-800 placeholder-gray-400 resize-y"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Furniture, Electronics, Books, Clothing"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Address / Map Picker */}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">Address / Pickup Location</label>
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address or select on map"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200 text-gray-800 placeholder-gray-400"
            />
            <p className="text-sm text-gray-600 mt-2">Or click on the map to select a location:</p>
            {/* MapPicker component */}
            <MapPicker onPick={(selectedAddress) => setAddress(selectedAddress)} />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-semibold text-gray-700 mb-1">Upload Image</label>
            <input
              id="imageUpload"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              required
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-white file:bg-emerald-600 file:hover:bg-emerald-700 file:font-semibold file:shadow-md file:cursor-pointer transition duration-200 ease-in-out"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3.5 px-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 ease-in-out transform hover:scale-100 shadow-lg"
          >
            {uploading ? "Uploading..." : "List Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
