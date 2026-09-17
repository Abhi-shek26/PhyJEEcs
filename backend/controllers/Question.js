const cloudinary = require("../config/cloudinary");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");

// Upload Question (admin-only enforced at route level)
exports.uploadQuestion = async (req, res) => {
  try {
    const { title, category, type, chapter, correctAnswer, difficulty, solutionText } = req.body;

    if (!title || !category || !type || !chapter || !correctAnswer) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({ error: "Invalid difficulty" });
    }
    if (category && !["JM", "JA"].includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    if (type && !["SCQ", "MCQ", "Numerical"].includes(type)) {
      return res.status(400).json({ error: "Invalid question type" });
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
        } else if (type === "SCQ") {
          formattedCorrectAnswer = correctAnswer.trim().toUpperCase();
        } else if (type === "MCQ") {
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
          difficulty: difficulty || "Medium",
          solutionText: solutionText || "",
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

// Fetch Questions (paginated, injection-safe, answers hidden by default)
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
exports.getQuestions = async (req, res) => {
  try {
    const { title, category, type, chapter, difficulty } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const includeAnswers = req.query.includeAnswers === "1";

    const filter = {};
    if (title) filter.title = { $regex: `^${escapeRegex(title)}$`, $options: "i" };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (chapter) filter.chapter = chapter;
    if (difficulty) filter.difficulty = difficulty;

    const total = await Question.countDocuments(filter);
    const projection = includeAnswers ? {} : { correctAnswer: 0 };
    const questions = await Question.find(filter, projection)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ data: questions, page, limit, total });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: err.message });
  }
};

//attemptQuestion
exports.attemptQuestion = async (req, res) => {
  // console.log("Received attempt data:", req.body);
  // console.log("User ID:", req.user?._id);

  try {
    const { questionId, userAnswer, timeTaken } = req.body;
    const userId = req.user._id;

    if (!questionId || userAnswer === undefined) {
      return res
        .status(400)
        .json({ error: "Question ID and user answer are required" });
    }
    if (timeTaken !== undefined && (typeof timeTaken !== "number" || timeTaken < 0)) {
      return res.status(400).json({ error: "timeTaken must be a non-negative number" });
    }

    // Check if the user has already attempted this question
    const existingAttempt = await Attempt.findOne({ userId, questionId });
    if (existingAttempt) {
      return res
        .status(400)
        .json({ error: "You have already attempted this question" });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    let isCorrect = false;

    if (question.type === "SCQ") {
      if (typeof userAnswer !== "string") {
        return res.status(400).json({ error: "SCQ answer must be a string" });
      }
      isCorrect =
        question.correctAnswer.trim().toUpperCase() ===
        userAnswer.trim().toUpperCase();
    } else if (question.type === "MCQ") {
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

    // Save the attempt
    const newAttempt = new Attempt({
      userId,
      questionId,
      userAnswer,
      isCorrect,
      timeTaken,
    });

    await newAttempt.save();

    res.status(200).json({
      message: isCorrect ? "Correct Answer!" : "Incorrect Answer",
      isCorrect,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already attempted this question" });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid question ID" });
    }
    res.status(500).json({ error: err.message });
  }
};
