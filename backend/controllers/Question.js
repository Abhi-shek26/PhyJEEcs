const cloudinary = require("../config/cloudinary");
const Question = require("../models/Question");

// Upload Question
exports.uploadQuestion = async (req, res) => {
  try {
    const { title, category, type, chapter, correctAnswer } = req.body;

    if (!title || !category || !type || !chapter || !correctAnswer) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Upload image to Cloudinary from memory
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `Questions/${chapter}/${category}/${type}` },
      async (error, cloudinaryResult) => {
        if (error) return res.status(500).json({ error: error.message });

        let formattedCorrectAnswer;
        if (type === "Numerical") {
          formattedCorrectAnswer = parseFloat(correctAnswer);
          if (isNaN(formattedCorrectAnswer)) {
            return res
              .status(400)
              .json({ error: "Numerical answer must be a valid number" });
          }
        } else if (type === "Single Correct") {
          formattedCorrectAnswer = correctAnswer.trim().toUpperCase();
        } else if (type === "Multiple Correct") {
          formattedCorrectAnswer = correctAnswer
            .split(",")
            .map((opt) => opt.trim().toUpperCase())
            .filter(Boolean);
        } else {
          return res.status(400).json({ error: "Invalid question type" });
        }

        // Save question to MongoDB
        const newQuestion = new Question({
          title,
          imageUrl: cloudinaryResult.secure_url,
          category,
          type,
          chapter,
          correctAnswer: formattedCorrectAnswer,
        });

        await newQuestion.save();
        res.status(201).json({
          message: "Question uploaded successfully",
          question: newQuestion,
        });
      }
    );

    // Pass the file buffer to Cloudinary
    uploadStream.end(req.file.buffer);
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

    const questions = await Question.find(filter).sort({ createdAt: -1 }); // Latest questions first
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//attemptQuestion
exports.attemptQuestion = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;

    if (!questionId || userAnswer === undefined) {
      return res
        .status(400)
        .json({ error: "Question ID and user answer are required" });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    let isCorrect = false;

    if (question.type === "Single Correct") {
      isCorrect = question.correctAnswer === userAnswer.trim().toUpperCase();
    } else if (question.type === "Multiple Correct") {
      if (!Array.isArray(userAnswer)) {
        return res
          .status(400)
          .json({ error: "Multiple correct answers must be an array" });
      }

      const correctSet = new Set(question.correctAnswer);
      const userSet = new Set(
        userAnswer.map((opt) => opt.trim().toUpperCase())
      );

      isCorrect =
        correctSet.size === userSet.size &&
        [...correctSet].every((opt) => userSet.has(opt));
    } else if (question.type === "Numerical") {
      isCorrect = parseFloat(userAnswer) === question.correctAnswer;
    }

    res.status(200).json({
      message: isCorrect ? "Correct Answer!" : "Incorrect Answer",
      isCorrect,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
