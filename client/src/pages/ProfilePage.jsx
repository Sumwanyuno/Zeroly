import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";

// Define your API base URL here.
// IMPORTANT: Replace 5001 with the actual port your backend server is running on.
const API_BASE_URL = "http://localhost:5001/api"; // <-- Added this line for the base URL

const ProfilePage = () => {
  const { userInfo } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userInfo) {
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        // Update the API call to use the full API_BASE_URL
        const { data } = await axios.get(`${API_BASE_URL}/users/profile`, config); // <-- Changed this line
        setUserProfile(data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userInfo]);

  const handleDelete = async (deletedItemId) => {
    if (!userInfo) {
      alert("You must be logged in to delete an item.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      // Update the API call to use the full API_BASE_URL
      await axios.delete(`${API_BASE_URL}/items/${deletedItemId}`, config); // <-- Changed this line
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        items: prevProfile.items.filter((item) => item._id !== deletedItemId),
      }));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(
        error.response?.data?.message || "You are not authorized to delete this item."
      );
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading profile...</p>;
  }

  if (!userProfile) {
    return (
      <p className="text-center mt-8">Could not load profile. Please log in.</p>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 pt-8">
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800">
            {userProfile.name}
          </h1>
          <p className="text-md text-gray-600">{userProfile.email}</p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Your Listed Items
        </h2>
        {userProfile.items.length === 0 ? (
          <p className="text-center text-gray-500">
            You have not listed any items yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {userProfile.items.map((item) => (
              <ItemCard key={item._id} item={item} onDelete={handleDelete} userId={userInfo?._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
