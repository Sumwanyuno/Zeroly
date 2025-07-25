
// client/src/pages/HomePage.jsx

import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from "react"; // Import useRef and useLayoutEffect
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";
import Hero from "../components/Hero"; // Hero component is now ref-forwarding
import StarRating from "../components/StarRating";

const API_BASE_URL = "http://localhost:5001/api";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();

  // --- NEW: Create refs for sections to scroll to ---
  const heroSectionRef = useRef(null);
  const aboutUsSectionRef = useRef(null);


  // Effect to fetch items (no changes here)
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/items?keyword=${keyword}`);
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

  // --- UPDATED: useLayoutEffect for scrolling to refs ---
  useLayoutEffect(() => {
    console.log("HomePage useLayoutEffect triggered. Location hash:", location.hash);
    if (location.hash) {
      const id = location.hash.substring(1); // Get element ID without '#'

      let elementToScroll = null;
      if (id === 'hero-section' && heroSectionRef.current) {
        elementToScroll = heroSectionRef.current;
        console.log("Found heroSectionRef:", elementToScroll);
      } else if (id === 'about-us-section' && aboutUsSectionRef.current) {
        elementToScroll = aboutUsSectionRef.current;
        console.log("Found aboutUsSectionRef:", elementToScroll);
      } else {
        // Fallback to getElementById if ref isn't found (e.g., for other potential anchors)
        elementToScroll = document.getElementById(id);
        console.log(`Fallback: Found element by ID "${id}":`, elementToScroll);
      }

      if (elementToScroll) {
        elementToScroll.scrollIntoView({ behavior: 'smooth' });
        console.log(`Scrolled to element with ID/Ref: "${id}"`);
      } else {
        console.log(`Element with ID/Ref "${id}" NOT found.`);
      }
    } else {
      console.log("No hash in URL.");
    }
  }, [location]); // Re-run effect when location (including hash) changes


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
    <div className="bg-green-50 min-h-screen font-sans">
      {/* --- UPDATED: Pass the ref to the Hero component --- */}
      <Hero ref={heroSectionRef} />

      <div className="container mx-auto p-4 py-8 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-800">
            Recently Listed Treasures
          </h1>
          <p className="text-gray-600 mt-2">
            Join our mission to give items a second life.
          </p>
        </div>

        {/* Search Bar */}
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

        {/* Item Listing */}
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

        {/* About Us Section (ADDED REF) */}
        <div
          ref={aboutUsSectionRef} // <--- ATTACH THE REF HERE
          id="about-us-section" // Keep ID for consistency, but ref is primary for scrolling
          className="mt-16 py-12 px-6 bg-white rounded-xl shadow-lg md:px-12
                    transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-102"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-800 text-center mb-6">
            About Zeroly
          </h2>
          <div className="text-gray-700 leading-relaxed text-lg text-justify">
            <p className="mb-4">
              Zeroly is a sustainable sharing platform that connects people who want to donate unused items with those who need them. Our goal is to reduce waste, promote reuse, and support a circular economy.
              We focus on local giving, encouraging communities to declutter responsibly, conserve resources, and strengthen social bonds.
            </p>
            <p className="mb-4">
              Every item shared on Zeroly helps create a greener, cleaner, and more connected world.
            </p>
            <p className="mt-6 text-justify">
              <strong>Key Features of Zeroly:</strong><br/><br/>
              <strong>• Item Listing:</strong><br/>
              - List items you want to donate or view available listings from others in your area.<br/>
              <strong>• Buy or Request:</strong><br/>
              - Express interest in items or request to receive them directly through the platform.<br/>
              <strong>• Messaging & Reviews:</strong><br/>
              - Contact item owners via in-app messaging or leave reviews after an exchange.<br/>
              <strong>🏆 Leaderboard:</strong><br/>
              - A dynamic leaderboard highlights top contributors—those who donate or receive the most, encouraging active participation.
            </p>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/about"
              className="inline-block bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 transition duration-300 transform hover:scale-105"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
        {/* --- END: About Us Section --- */}
      </div>
    </div>
  );
};

export default HomePage;