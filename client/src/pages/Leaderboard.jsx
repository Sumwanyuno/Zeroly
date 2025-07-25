import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await axios.get('/api/leaderboard');
      setLeaders(res.data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-green-800 mb-8">
        Zeroly Leaderboard
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-green-700 text-white text-lg">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Items Uploaded</th>
              <th className="py-3 px-4">Points</th>
              <th className="py-3 px-4">Rank</th>
            </tr>
          </thead>
          <tbody className="text-center text-gray-700 text-md">
            {leaders.map((user) => (
              <tr
                key={user.username}
                className="hover:bg-green-100 transition duration-150"
              >
                <td className="py-3 px-4">{user.serial}</td>
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.itemCount}</td>
                <td className="py-3 px-4">{user.points}</td>
                <td className="py-3 px-4">{user.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
