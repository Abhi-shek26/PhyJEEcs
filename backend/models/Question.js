const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    enum: ["JM", "JA"],
    required: true,
  },
  type: {
    type: String,
    enum: ["SCQ", "Numerical", "MCQ"],
    required: true,
  },
  chapter: { type: String, required: true },
  correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
