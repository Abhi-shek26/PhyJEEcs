const Feedback = require("../models/Feedback");

// POST /api/feedback { questionId, rating 1-5, text? }
exports.submitFeedback = async (req, res) => {
  try {
    const { questionId, rating, text } = req.body;
    if (!questionId || !rating) return res.status(400).json({ error: "questionId and rating required" });
    if (rating < 1 || rating > 5) return res.status(400).json({ error: "rating must be 1-5" });
    const fb = await Feedback.create({ userId: req.user._id, questionId, rating, text: text || "" });
    res.status(201).json(fb);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ error: "Invalid question ID" });
    res.status(500).json({ error: err.message });
  }
};

// GET /api/feedback?questionId=... (avg rating per question, useful for PA quality metric)
exports.getFeedback = async (req, res) => {
  try {
    const filter = {};
    if (req.query.questionId) filter.questionId = req.query.questionId;
    const items = await Feedback.find(filter).sort({ createdAt: -1 }).limit(100);
    const avg = items.length ? items.reduce((s, f) => s + f.rating, 0) / items.length : 0;
    res.json({ count: items.length, avgRating: Math.round(avg * 10) / 10, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
