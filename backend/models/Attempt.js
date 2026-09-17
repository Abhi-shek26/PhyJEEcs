const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  userAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, default: 0, min: 0 },
  attemptedAt: { type: Date, default: Date.now },
});

// Prevent duplicate attempts at DB level (was app-level only) + speed up analytics
attemptSchema.index({ userId: 1, questionId: 1 }, { unique: true });
attemptSchema.index({ userId: 1, attemptedAt: -1 });


module.exports = mongoose.model("Attempt", attemptSchema);
