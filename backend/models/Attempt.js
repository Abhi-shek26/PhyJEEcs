const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: {type: String, ref: "Question",},
  imageUrl: {type: String, ref: "Question", },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  chapter:{ type: String, ref: "Question", },
  category:{ type: String, ref: "Question", },
  userAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, default: 0 },
  attemptedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attempt", attemptSchema);
