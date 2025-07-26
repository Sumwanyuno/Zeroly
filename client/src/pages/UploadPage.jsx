
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MapPicker from "../components/MapPicker";
import 'leaflet/dist/leaflet.css';


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

      const { data: uploadData } = await axios.post(
        "/api/upload",
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

      await axios.post("/api/items", newItem, itemConfig);

      setUploading(false);
      alert("Item created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating item:", error);
      setUploading(false);
      alert("Failed to create item.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-white p-4">
      <div className="w-full max-w-xl p-8 space-y-6 bg-white rounded-xl shadow-xl border border-emerald-200">
        <h1 className="text-3xl font-bold text-center text-emerald-700">
          List a New Item
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item Name"
            required
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            rows="4"
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address / Pickup Location"
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <p className="text-sm text-gray-600 mb-2">Or select on map:</p>
          <MapPicker onPick={(selectedAddress) => setAddress(selectedAddress)} />


          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-emerald-600 file:hover:bg-emerald-700"
          />
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition"
          >
            {uploading ? "Uploading..." : "List Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
