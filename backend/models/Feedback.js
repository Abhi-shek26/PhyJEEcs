const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

feedbackSchema.index({ questionId: 1, rating: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
