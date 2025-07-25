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
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 to-green-200">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-green-900 mb-12 drop-shadow-sm">
          🌿 Zeroly Leaderboard
        </h1>
        <div className="overflow-x-auto rounded-2xl shadow-2xl border border-green-300 bg-white">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-green-700 text-white text-md uppercase tracking-wide">
              <tr>
                <th className="py-4 px-6 text-left">#</th>
                <th className="py-4 px-6 text-left">Username</th>
                <th className="py-4 px-6 text-left">Items Uploaded</th>
                <th className="py-4 px-6 text-left">Points</th>
                <th className="py-4 px-6 text-left">Rank</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((user, index) => (
                <tr
                  key={user.username}
                  className={`hover:bg-green-100 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-green-50'
                  }`}
                >
                  <td className="py-4 px-6 font-semibold">{user.serial}</td>
                  <td className="py-4 px-6">{user.username}</td>
                  <td className="py-4 px-6">{user.itemCount}</td>
                  <td className="py-4 px-6">{user.points}</td>
                  <td className="py-4 px-6">{user.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 text-center text-gray-600 text-sm">
          💡 Keep uploading to climb the ranks and make your community greener!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
