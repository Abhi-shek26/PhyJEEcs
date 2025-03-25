const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  category: {
    type: String,
    enum: ["JEE Mains", "JEE Advanced"],
  },
  type: {
    type: String,
    enum: ["Single Correct", "Numerical", "Multiple Correct"],
  },
  chapter: String, 
  correctAnswer: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
