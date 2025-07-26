import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";

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
        const { data } = await axios.get("/api/users/profile", config);
        setUserProfile(data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userInfo]);

  const handleDelete = (deletedItemId) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      items: prevProfile.items.filter((item) => item._id !== deletedItemId),
    }));
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
              <ItemCard key={item._id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
