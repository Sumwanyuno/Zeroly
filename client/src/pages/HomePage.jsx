// // // client/src/pages/HomePage.jsx
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { Link } from "react-router-dom"; // 1. Import Link for navigation
// // import ItemCard from "../components/ItemCard";
// // import Hero from "../components/Hero";

// // const HomePage = () => {
// //   const [items, setItems] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchItems = async () => {
// //       setLoading(true);
// //       try {
// //         const { data } = await axios.get("/api/items");
// //         setItems(data);
// //       } catch (error) {
// //         console.error("Error fetching items:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchItems();
// //   }, []);

// //   // 2. Add the function to handle deleting an item
// //   const handleDelete = async (id) => {
// //     if (window.confirm("Are you sure you want to delete this item?")) {
// //       try {
// //         await axios.delete(`/api/items/${id}`);
// //         setItems(items.filter((item) => item._id !== id));
// //       } catch (error) {
// //         console.error("Error deleting item:", error);
// //         alert("Failed to delete item.");
// //       }
// //     }
// //   };

// //   return (
// //     <div className="bg-gray-50 min-h-screen">
// //       <Hero />
// //       <div className="container mx-auto p-4 pt-8">
// //         {/* 3. Add a header with a link to the upload page */}
// //         <div className="flex justify-between items-center mb-8">
// //           <h1 className="text-4xl font-bold text-gray-800">Items Available</h1>
// //           {/* <Link
// //             to="/upload"
// //             className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
// //           >
// //             + List an Item
// //           </Link> */}
// //         </div>

// //         {loading ? (
// //           <p className="text-center">Loading items...</p>
// //         ) : items.length === 0 ? (
// //           <p className="text-center text-gray-500">
// //             No items have been listed yet. Be the first!
// //           </p>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
// //             {items.map((item) => (
// //               <ItemCard
// //                 key={item._id}
// //                 item={item}
// //                 onDelete={handleDelete} // 4. Pass the delete function to each card
// //               />
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default HomePage;
// // client/src/pages/HomePage.jsx
// import React, { useState, useEffect, useContext } from "react"; // Import useContext
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext"; // Import AuthContext
// import ItemCard from "../components/ItemCard";
// import Hero from "../components/Hero";

// const HomePage = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { userInfo } = useContext(AuthContext); // Get user info for authentication

//   useEffect(() => {
//     const fetchItems = async () => {
//       setLoading(true);
//       try {
//         const { data } = await axios.get("/api/items");
//         setItems(data);
//       } catch (error) {
//         console.error("Error fetching items:", error);
//         alert("Failed to load items. Please try refreshing the page.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchItems();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       try {
//         // Corrected: Added config with token for protected delete route
//         const config = {
//           headers: {
//             Authorization: `Bearer ${userInfo.token}`,
//           },
//         };
//         // Corrected: The URL is now a proper template literal string
//         await axios.delete(`/api/items/${id}`, config);
//         setItems(items.filter((item) => item._id !== id));
//         alert("Item deleted successfully!");
//       } catch (error) {
//         console.error("Error deleting item:", error);
//         alert("Failed to delete item. You may not be the owner.");
//       }
//     }
//   };

//   return (
//     <div className="bg-green-50 min-h-screen font-sans">
//       <Hero />
//       <div className="container mx-auto p-4 py-8 md:px-8">
//         <div className="text-center mb-12">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-green-800">
//             Recently Listed Treasures
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Join our mission to give items a second life.
//           </p>
//         </div>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
//             <p className="text-center text-green-700 text-xl font-medium">
//               Loading items...
//             </p>
//           </div>
//         ) : items.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 bg-white bg-opacity-70 rounded-xl shadow-md p-8">
//             <svg
//               className="w-20 h-20 text-green-600 mb-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//               ></path>
//             </svg>
//             <p className="text-center text-green-600 text-xl font-medium">
//               No treasures found yet! Be the first to build a zero-waste
//               community.
//             </p>
//             <Link
//               to="/upload"
//               className="mt-6 px-6 py-3 text-white bg-green-600 rounded-full font-semibold shadow-md hover:bg-green-700 transition duration-200 transform hover:scale-105"
//             >
//               List Your First Item
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//             {items.map((item) => (
//               <ItemCard key={item._id} item={item} onDelete={handleDelete} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// client/src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";
import Hero from "../components/Hero";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  // 1. Add state for the search keyword
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        // 2. Update the API call to include the keyword in the request
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
  }, [keyword]); // 3. Re-run the fetch whenever the keyword changes

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/items/${id}`, config);
        setItems(items.filter((item) => item._id !== id));
        alert("Item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. You may not be the owner.");
      }
    }
  };

  // 4. This function handles the form submission (though useEffect handles the logic)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The useEffect hook is already watching the 'keyword' state,
    // so we don't need to do anything else here.
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

        {/* --- Start of New Search Bar --- */}
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
        {/* --- End of New Search Bar --- */}

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
              <ItemCard key={item._id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
