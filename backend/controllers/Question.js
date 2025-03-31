const cloudinary = require("../config/cloudinary");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");

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
    const { title, category, type, chapter } = req.query;

    const filter = {};
    if (title) filter.title = { $regex: `^${title}$`, $options: "i" };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (chapter) filter.chapter = chapter;

    console.log("Filter applied:", filter); // Debugging output

    const questions = await Question.find(filter).sort({ createdAt: -1 });

    console.log("Questions found:", questions.length); // Debugging output
    res.status(200).json(questions);
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

    if (question.type === "Single Correct") {
      isCorrect =
        question.correctAnswer.trim().toUpperCase() ===
        userAnswer.trim().toUpperCase();
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
    res.status(500).json({ error: err.message });
  }
};
