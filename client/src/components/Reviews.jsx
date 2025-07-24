import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import StarRating from "./StarRating";

const Reviews = ({ itemId }) => {
  const { userInfo } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [avg, setAvg] = useState(0);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/items/${itemId}/reviews`);
      setReviews(data.reviews || []);
      setAvg(data.averageRating || 0);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [itemId]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return alert("Add both rating and comment");
    try {
      await axios.post(
        `/api/items/${itemId}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Review failed");
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
          <div className="flex justify-between">
            <strong>{r.name}</strong>
            <StarRating value={r.rating} readOnly />
          </div>
          <p>{r.comment}</p>
        </div>
      ))}

      {userInfo ? (
        <form onSubmit={submitReview} className="mt-4">
          <StarRating value={rating} onChange={setRating} />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a review"
            className="w-full border rounded p-2 mt-2"
          />
          <button type="submit" className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </form>
      ) : (
        <p className="mt-2 text-sm text-gray-600">Login to write a review.</p>
      )}
    </div>
  );
};

export default Reviews;
