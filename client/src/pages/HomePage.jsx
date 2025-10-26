import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";
import Hero from "../components/Hero";
import api from "../api.js";
import ctaBg from "../assets/img/cta-bg.jpg";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();

  const heroSectionRef = useRef(null);
  const aboutUsSectionRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/items?keyword=${keyword}`);
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

  useLayoutEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const elementToScroll =
        id === "hero-section"
          ? heroSectionRef.current
          : id === "about-us-section"
          ? aboutUsSectionRef.current
          : document.getElementById(id);

      if (elementToScroll) {
        elementToScroll.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleDelete = async (id) => {
    if (!userInfo?._id) {
      alert("You must be logged in to delete an item.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(
        error.response?.data?.message ||
          "You are not authorized to delete this item."
      );
    }
  };

  return (
    <div className="bg-green-50 min-h-screen font-sans">
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
                userId={userInfo?._id || ""}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* About Us Section */}
        <div
          ref={aboutUsSectionRef}
          id="about-us-section"
          className="mt-16 py-12 px-6 rounded-xl shadow-lg md:px-12 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: `url(${ctaBg})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50 z-0 rounded-xl"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-400 text-center mb-6 relative z-10 drop-shadow-lg">
            About Zeroly
          </h2>
          <div className="text-white leading-relaxed text-lg text-justify relative z-10">
            <p className="mb-4">
              <strong>Zeroly is a sustainable sharing platform...</strong>
            </p>
            {/* You can add more about text here */}
          </div>
          <div className="text-center mt-8 relative z-10">
            <Link
              to="/faq"
              className="inline-block bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 transition duration-300 transform hover:scale-105"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
