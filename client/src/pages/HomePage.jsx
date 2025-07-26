
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";
import Hero from "../components/Hero";
import StarRating from "../components/StarRating";


const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/items?keyword=${keyword}`);
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("Failed to load items. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [keyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

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
      await axios.delete(`/api/items/${id}`, config);
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
    <div className="bg-green-50 min-h-screen font-sans">
      <Hero />
      <div className="container mx-auto p-4 py-8 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-800">
            Recently Listed Treasures
          </h1>
          <p className="text-gray-600 mt-2">
            Join our mission to give items a second life.
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="mb-12 max-w-2xl mx-auto flex shadow-lg"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search for items by name or category..."
            className="w-full px-5 py-3 border-2 border-r-0 border-green-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-r-full hover:bg-green-700 transition"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
            <p className="text-center text-green-700 text-xl font-medium">
              Loading items...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white bg-opacity-70 rounded-xl shadow-md p-8">
            <p className="text-center text-green-600 text-xl font-medium">
              No items found. Try a different search or be the first to list an
              item!
            </p>
            <Link
              to="/upload"
              className="mt-6 px-6 py-3 text-white bg-green-600 rounded-full font-semibold shadow-md hover:bg-green-700 transition duration-200 transform hover:scale-105"
            >
              List an Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
