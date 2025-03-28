const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    enum: ["JEE Mains", "JEE Advanced"],
    required: true,
  },
  type: {
    type: String,
    enum: ["Single Correct", "Numerical", "Multiple Correct"],
    required: true,
  },
  chapter: { type: String, required: true },
  correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
