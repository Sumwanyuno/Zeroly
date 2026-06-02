import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ points: -1 })
      .select("name itemCount points");

    const rankedUsers = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      itemCount: user.itemCount,
      points: user.points,
    }));

    res.status(200).json(rankedUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
  }
};
