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
  // Merged-domain fields: DA/PA segmentation + AI personalization
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
  solutionText: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

questionSchema.index({ chapter: 1, category: 1, type: 1 });
questionSchema.index({ title: 1 });

module.exports = mongoose.model("Question", questionSchema);
