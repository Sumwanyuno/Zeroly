// client/src/pages/LeaderboardPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx"; // Added .jsx extension

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get current user from context

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/users/leaderboard");
        setLeaderboard(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load leaderboard. Please try again later.");
        setLoading(false);
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-8 rounded-lg p-2">
          🏆 Zero Waste Champions 🏆
        </h1>

        {loading ? (
          <div className="text-center text-lg text-gray-600">
            Loading leaderboard...
          </div>
        ) : error ? (
          <div className="text-center text-lg text-red-500">{error}</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-lg text-gray-600">
            No champions yet! Start donating items to earn points.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-200 rounded-lg overflow-hidden">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg"
                  >
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.username}
                    className={`${
                      user && user.username === entry.username
                        ? "bg-yellow-100 font-semibold text-yellow-800" // Highlight current user
                        : index % 2 === 0
                        ? "bg-gray-50"
                        : "bg-white"
                    } hover:bg-green-50 transition duration-150 ease-in-out`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-bl-lg">
                      {entry.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {entry.username}{" "}
                      {user && user.username === entry.username && "(You)"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 rounded-br-lg">
                      {entry.itemPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Earn points by uploading usable items and contributing to a
            zero-waste community!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
