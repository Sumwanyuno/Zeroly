// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import StarRating from "./StarRating";

// const { userInfo } = useContext(AuthContext);
// const isOwner = userInfo?._id === ownerId; // ownerId will be passed from parent

// const Reviews = ({ itemId }) => {
//   const { userInfo } = useContext(AuthContext);
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [avg, setAvg] = useState(0);

//   const fetchReviews = async () => {
//     try {
//       const { data } = await axios.get(`/api/items/${itemId}/reviews`);
//       setReviews(data.reviews || []);
//       setAvg(data.averageRating || 0);
//     } catch (err) {
//       console.error("Failed to fetch reviews", err);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, [itemId]);

//   const submitReview = async (e) => {
//     e.preventDefault();
//     if (!rating || !comment) return alert("Add both rating and comment");
//     try {
//       await axios.post(
//         `/api/items/${itemId}/reviews`,
//         { rating, comment },
//         {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         }
//       );
//       setRating(0);
//       setComment("");
//       fetchReviews();
//     } catch (err) {
//       alert(err.response?.data?.message || "Review failed");
//     }
//   };

//   return (
//     <div className="mt-6">
//       <h3 className="text-lg font-bold mb-2">Reviews</h3>
//       <div className="mb-4 flex items-center gap-2">
//         <StarRating value={avg} readOnly />
//         <span>{avg.toFixed(1)} / 5</span>
//       </div>

//       {reviews.length === 0 && <p>No reviews yet.</p>}
//       {reviews.map((r) => (
//         <div key={r._id} className="p-3 border rounded mb-2 bg-gray-50">
//           <div className="flex justify-between">
//             <strong>{r.name}</strong>
//             <StarRating value={r.rating} readOnly />
//           </div>
//           <p>{r.comment}</p>
//         </div>
//       ))}

//       {userInfo ? (
//         <form onSubmit={submitReview} className="mt-4">
//           <StarRating value={rating} onChange={setRating} />
//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Write a review"
//             className="w-full border rounded p-2 mt-2"
//           />
//           <button type="submit" className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded">
//             Submit Review
//           </button>
//         </form>
//       ) : (
//         <p className="mt-2 text-sm text-gray-600">Login to write a review.</p>
//       )}
//     </div>
//   );
// };

// export default Reviews;



import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Reverted to original path for AuthContext
import StarRating from "./StarRating";

const Reviews = ({ itemId, ownerId }) => {
  const { userInfo } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [avg, setAvg] = useState(0);

  // --- IMPORTANT: Create an Axios instance with the base URL for your API ---
  const api = axios.create({
    baseURL: "http://localhost:5001/api", // Your backend API runs on port 5001
  });

  const isOwner = userInfo?._id === ownerId; // Check if the logged-in user is the owner

  const fetchReviews = async () => {
    try {
      // Use the 'api' instance for the GET request
      const { data } = await api.get(`/items/${itemId}/reviews`);
      setReviews(data.reviews || []);
      setAvg(data.averageRating || 0);
    } catch (err) {
      console.error("Failed to fetch reviews:", err); // More descriptive error message
    }
  };

  useEffect(() => {
    // Make sure itemId is available before fetching reviews
    if (itemId) {
      fetchReviews();
    }
  }, [itemId]); // Dependency array includes itemId to refetch if it changes

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      return alert("Please add both a rating and a comment to submit your review.");
    }

    try {
      // Use the 'api' instance for the POST request
      await api.post(
        `/items/${itemId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setRating(0); // Reset rating after successful submission
      setComment(""); // Reset comment after successful submission
      fetchReviews(); // Re-fetch reviews to show the new one
    } catch (err) {
      // Improved error handling
      console.error("Review submission failed:", err);
      alert(err.response?.data?.message || "Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Reviews</h3>
      <div className="mb-4 flex items-center gap-2">
        <StarRating value={avg} readOnly />
        <span>{avg.toFixed(1)} / 5</span>
      </div>

      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map((r) => (
        <div key={r._id} className="p-3 border rounded mb-2 bg-gray-50">
          <div className="flex justify-between items-center"> {/* Added items-center for better alignment */}
            <strong className="text-gray-800">{r.name}</strong>
            <StarRating value={r.rating} readOnly />
          </div>
          <p className="text-gray-700 mt-1">{r.comment}</p>
        </div>
      ))}

      {userInfo ? ( // If a user is logged in
        isOwner ? ( // If the logged-in user is the item owner
          <p className="mt-2 text-sm text-gray-600">
            You cannot review your own item.
          </p>
        ) : (
          // Allow submitting a review if not the owner
          <form onSubmit={submitReview} className="mt-4 p-4 border rounded bg-white shadow-sm">
            <h4 className="font-semibold mb-3">Submit Your Review</h4>
            <div className="mb-3">
                <StarRating value={rating} onChange={setRating} />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this item..."
              rows="4" // Added rows for better textarea appearance
              className="w-full border border-gray-300 rounded p-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
            />
            <button
              type="submit"
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Submit Review
            </button>
          </form>
        )
      ) : (
        // Prompt to login if no user is logged in
        <p className="mt-4 text-sm text-gray-700 p-3 border border-blue-200 bg-blue-50 rounded">
          Please <span className="font-semibold text-blue-700">log in</span> to write a review.
        </p>
      )}
    </div>
  );
};

export default Reviews;
