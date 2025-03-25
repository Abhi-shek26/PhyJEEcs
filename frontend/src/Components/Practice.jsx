import React, { useState, useEffect } from "react";
import Question from "./Question";
import "./Practice.css";

const Practice = () => {
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [level, setLevel] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch questions from API when filters change
  useEffect(() => {
    if (!subject || !chapter || !level || !questionType) return;

    const fetchQuestions = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:4000/api/questions?subject=${subject}&chapter=${chapter}&level=${level}&type=${questionType}`
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to fetch questions");

        setQuestions(data);
        setCurrentQuestionIndex(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subject, chapter, level, questionType]);

  const handleSubmitAnswer = (userAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
      JSON.stringify(userAnswer.sort()) ===
      JSON.stringify(currentQuestion.correctAnswer.sort());

    setAttemptedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: { userAnswer, isCorrect },
    }));

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 1000);
  };

  return (
    <div className="practice-container">
      <h1>Practice Questions</h1>

      <div className="filter-section">
        <select onChange={(e) => setSubject(e.target.value)} value={subject}>
          <option value="">Select Subject</option>
          <option value="Physics">Physics</option>
          <option value="Mathematics">Mathematics</option>
        </select>

        <select onChange={(e) => setChapter(e.target.value)} value={chapter}>
          <option value="">Select Chapter</option>
          <option value="Motion">Motion</option>
          <option value="Algebra">Algebra</option>
        </select>

        <select onChange={(e) => setLevel(e.target.value)} value={level}>
          <option value="">Select Level</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select onChange={(e) => setQuestionType(e.target.value)} value={questionType}>
          <option value="">Select Question Type</option>
          <option value="Single Correct">Single Correct</option>
          <option value="Multiple Correct">Multiple Correct</option>
          <option value="Numerical">Numerical</option>
        </select>
      </div>

      {loading && <p>Loading questions...</p>}
      {error && <p className="error">{error}</p>}

      {questions.length > 0 && !loading && (
        <Question
          question={questions[currentQuestionIndex]}
          onSubmit={handleSubmitAnswer}
          attempted={attemptedQuestions[questions[currentQuestionIndex]?.id]}
        />
      )}
    </div>
  );
};

export default Practice;
