import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";
import Hero from "../components/Hero";

const API_BASE_URL = "/api"; 

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/items`);
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("Failed to load items. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!userInfo) {
      alert("You must be logged in to delete an item.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.delete(`${API_BASE_URL}/items/${id}`, config);
      setItems((prev) => prev.filter((item) => item._id !== id));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(
        error.response?.data?.message || "You are not authorized to delete this item."
      );
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Hero />
      <div className="container mx-auto p-4 py-16 md:px-12 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-brand-green font-bold text-sm tracking-[0.2em] uppercase mb-4">
            Fresh Picks
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">
            Recently Listed Treasures
          </h2>
          <p className="text-gray-600 text-lg">
            Join our mission to give items a second life.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-green mb-4"></div>
            <p className="text-center text-brand-green text-lg font-medium">
              Loading treasures...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white bg-opacity-60 rounded-3xl shadow-sm border border-brand-border p-10 max-w-xl mx-auto">
            <p className="text-center text-gray-700 text-lg font-medium mb-6">
              No items found. Be the first to list an item and help green the planet!
            </p>
            <Link
              to="/upload"
              className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold shadow-md hover:bg-green-700 transition"
            >
              List an Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                userId={userInfo?._id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;