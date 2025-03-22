const cloudinary = require("../config/cloudinary");
const Question = require("../models/Question");

// Upload Question
exports.uploadQuestion = async (req, res) => {
  try {
    const { title, category, type, chapter } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload image to Cloudinary
    cloudinary.uploader.upload_stream(
      { folder: `Questions//${chapter}${category}/${type}` },
      async (error, cloudinaryResult) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        // Save question in MongoDB
        const newQuestion = new Question({
          title,
          imageUrl: cloudinaryResult.secure_url,
          category,
          type,
          chapter,
        });

        await newQuestion.save();
        res.status(201).json({ message: "Question uploaded", question: newQuestion });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch Questions
exports.getQuestions = async (req, res) => {
  try {
    const { category, type, chapter } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (chapter) filter.chapter = chapter;

    const questions = await Question.find(filter);
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
