const Attempt = require("../models/Attempt");

// Fetch Attempts (paginated, newest first)
exports.getUserAttempts = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    const total = await Attempt.countDocuments({ userId });
    const attempts = await Attempt.find({ userId })
      .sort({ attemptedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("questionId", "title imageUrl type category chapter difficulty correctAnswer")

    res.status(200).json({ data: attempts, page, limit, total });
  } catch (err) {
    console.error("Error fetching user attempts:", err);
    res.status(500).json({ error: err.message });
  }
};
