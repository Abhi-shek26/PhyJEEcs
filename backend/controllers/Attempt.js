const Attempt = require("../models/Attempt");

// Fetch Attempts
exports.getUserAttempts = async (req, res) => {
  try {
    const userId = req.user._id;

    const attempts = await Attempt.find({ userId })
      // .sort({ attemptedAt: -1 }) // Ensures most recent first
      .populate("questionId", "title imageUrl type category chapter correctAnswer")

    res.status(200).json(attempts);
  } catch (err) {
    console.error("Error fetching user attempts:", err);
    res.status(500).json({ error: err.message });
  }
};
