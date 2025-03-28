const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  userAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, default: 0 }, // Store time in seconds
  attemptedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attempt", attemptSchema);
