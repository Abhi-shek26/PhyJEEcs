const Bookmark = require("../models/Bookmark");

// GET /api/bookmarks
exports.listBookmarks = async (req, res) => {
  const items = await Bookmark.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate("questionId", "title imageUrl chapter category type difficulty");
  res.json(items);
};

// POST /api/bookmarks { questionId }
exports.toggleBookmark = async (req, res) => {
  try {
    const { questionId } = req.body;
    if (!questionId) return res.status(400).json({ error: "questionId required" });
    const existing = await Bookmark.findOne({ userId: req.user._id, questionId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ bookmarked: false });
    }
    await Bookmark.create({ userId: req.user._id, questionId });
    res.status(201).json({ bookmarked: true });
  } catch (err) {
    if (err.code === 11000) return res.json({ bookmarked: true });
    if (err.name === "CastError") return res.status(400).json({ error: "Invalid question ID" });
    res.status(500).json({ error: err.message });
  }
};
