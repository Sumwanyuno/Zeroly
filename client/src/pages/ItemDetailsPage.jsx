import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Reviews from "../components/Reviews";
import StarRating from "../components/StarRating"; 

const ItemDetailsPage = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`/api/items/${id}`);
        setItem(data);
      } catch (error) {
        console.error("Failed to fetch item details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleRequest = async () => {
    if (!userInfo) {
      alert("Please log in to request an item.");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post("/api/requests", { itemId: item._id }, config);
      alert("Request sent successfully!");
    } catch (error) {
      console.error("Failed to send request:", error);
      const message =
        error.response?.data?.message || "Failed to send request.";
      alert(message);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading item details...</p>;
  }

  if (!item) {
    return <p className="text-center mt-8">Item not found.</p>;
  }

  const isOwner = userInfo && userInfo._id === item.user;

  console.log("Item details:", item);
  console.log("Logged-in user:", userInfo);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            <div>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mb-3 px-3 py-1 rounded-full">
                {item.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {item.name}
              </h1>
              <div className="mb-4 flex items-center gap-2">
                <StarRating value={item.averageRating || 0} readOnly />
                <span className="text-sm text-gray-600">
                  ({item.numReviews || 0} reviews)
                </span>
              </div>
              <p className="text-gray-700 mb-6">{item.description}</p>

              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Pickup Location
                </h3>
                <p className="text-gray-600">{item.address}</p>
              </div>
              <div className="mt-8">
                {userInfo && !isOwner && (
                  <button
                    onClick={handleRequest}
                    className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
                  >
                    Request This Item
                  </button>
                )}
                {isOwner && (
                  <p className="mt-4 p-3 bg-blue-100 text-blue-800 text-center rounded-md">
                    You are the owner of this item.
                  </p>
                )}
                {!userInfo && (
                  <p className="mt-4 p-3 bg-yellow-100 text-yellow-800 text-center rounded-md">
                    <Link to="/login" className="font-semibold hover:underline">
                      Log in
                    </Link>{" "}
                    to request this item.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <Reviews itemId={item._id} ownerId={item.user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
