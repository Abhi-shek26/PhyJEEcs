import React, { useState } from "react";
import Question from "./Question";
import "./Practice.css";

const chapters = [
  "0.Basic Mathematics", "1.Units and Dimensions", "2.Kinematics", "3.Newton's Laws of Motion",
  "4.Work, Energy and Power", "5.Circular Motion", "6.Centre of Mass, Impulse and Momentum",
  "7.Rotational Motion", "8.Gravitation", "9.Elasticity", "10.Fluids", "11.SHM", "12.String Waves",
  "13.Sound Waves", "14.Thermal Properties of Matter", "15.KTG", "16.Thermodynamics", "17.Electrostatics and Potential",
  "18.Capacitance", "19.Current Electricity", "20.Magnetic Effects of Current", "21.EMI", "22.AC",
  "23.Ray Optics", "24.Wave Optics", "25.Modern Physics", "26.EM Waves", "27.Semiconductors", "28.Errors and Experiments"
];

const Practice = () => {
  const [chapter, setChapter] = useState("");
  const [level, setLevel] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    if (!chapter || !level || !questionType) {
      setError("Please select all filters before fetching questions.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:4000/api/questions?chapter=${chapter}&level=${level}&type=${questionType}`
      );
      const data = await response.json();
      console.log("Fetched Question Data:", data);
      if (!response.ok) throw new Error(data.message || "Failed to fetch questions");
      setQuestions(data);
      setCurrentQuestionIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = (userAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
      JSON.stringify(userAnswer.sort()) === JSON.stringify(currentQuestion.correctAnswer.sort());

    setAttemptedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: { userAnswer, isCorrect },
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="practice-container">
      <h1>Practice Questions</h1>

      <div className="filter-section">
        <select onChange={(e) => setChapter(e.target.value)} value={chapter}>
          <option value="">Select Chapter</option>
          {chapters.map((chap, index) => (
            <option key={index} value={chap}>{chap}</option>
          ))}
        </select>

        <select onChange={(e) => setLevel(e.target.value)} value={level}>
          <option value="">Select Level</option>
          <option value="JEE Mains">JEE Mains</option>
          <option value="JEE Advanced">JEE Advanced</option>
        </select>

        <select onChange={(e) => setQuestionType(e.target.value)} value={questionType}>
          <option value="">Select Question Type</option>
          <option value="Single Correct">Single Correct</option>
          <option value="Multiple Correct">Multiple Correct</option>
          <option value="Numerical">Numerical</option>
        </select>

        <button onClick={fetchQuestions} className="set-questions-btn">
          Set Questions
        </button>
      </div>

      {loading && <p>Loading questions...</p>}
      {questions.length === 0 && !loading && <p>No questions found.</p>}
      {error && <p className="error">{error}</p>}

      {questions.length > 0 && !loading && (
        <div className="question-section">
          <Question
            question={questions[currentQuestionIndex]}
            onSubmit={handleSubmitAnswer}
            attempted={attemptedQuestions[questions[currentQuestionIndex]?.id]}
          />
          <div className="navigation-buttons">
            <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
