const Attempt = require("../models/Attempt");

// Fetch Attempts
exports.getUserAttempts = async (req, res) => {
    try {
      const userId = req.user._id;
      const attempts = await Attempt.find({ userId }).populate("questionId", "text type correctAnswer");
  
      res.status(200).json(attempts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };