const cloudinary = require("../config/cloudinary");
const Question = require("../models/Question");

// Upload Question
exports.uploadQuestion = async (req, res) => {
  try {
    const { title, category, type, chapter , correctAnswer} = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload image to Cloudinary
    cloudinary.uploader.upload_stream(
      { folder: `Questions//${chapter}${category}/${type}` },
      async (error, cloudinaryResult) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        let formattedCorrectAnswer;

        if (type === "Numerical") {
          formattedCorrectAnswer = parseFloat(correctAnswer);
        } 
        else if (type === "Single Correct") {
          formattedCorrectAnswer = correctAnswer.toUpperCase(); // Ensure uppercase
        } 
        else if (type === "Multiple Correct") {
          formattedCorrectAnswer = correctAnswer.split(",").map((opt) => opt.trim().toUpperCase()); // Keep order
        } 
        else {
          return res.status(400).json({ error: "Invalid question type" });
        }

        // Save question in MongoDB
        const newQuestion = new Question({
          title,
          imageUrl: cloudinaryResult.secure_url,
          category,
          type,
          chapter,
          correctAnswer: formattedCorrectAnswer,
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

exports.attemptQuestion = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    let isCorrect = false;

    if (question.type === "Single Correct") {
      isCorrect = question.correctAnswer === userAnswer.toUpperCase();
    } 
    else if (question.type === "Multiple Correct") {
      // Convert both answers to sets to ignore order
      const correctSet = new Set(question.correctAnswer.map(opt => opt.trim().toUpperCase()));
      const userSet = new Set(userAnswer.map(opt => opt.trim().toUpperCase()));

      isCorrect = correctSet.size === userSet.size && [...correctSet].every(opt => userSet.has(opt));
    } 
    else if (question.type === "Numerical") {
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

