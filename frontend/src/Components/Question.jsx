import React, { useState } from "react";
import "./Question.css";
import { useFetchAttempts } from "../hooks/useFetchAttempts";
import { useAuthContext } from "../hooks/useAuthContext";
import Timer from "./Timer"; // Import Timer Component

const Question = ({ question }) => {
  const { user } = useAuthContext();
  const { attempts } = useFetchAttempts();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [numericalAnswer, setNumericalAnswer] = useState("");
  const [isAttempting, setIsAttempting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check if this question has already been attempted
  const isAttempted = attempts.some((q) => q.questionId._id === question._id);

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (question.type === "Single Correct") {
      setSelectedOptions([option]); // Only one selection allowed
    } else if (question.type === "Multiple Correct") {
      setSelectedOptions((prev) =>
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
      );
    }
  };

  // Handle attempt button click
  const handleAttempt = () => {
    setIsAttempting(true);
    setIsSubmitted(false);
  };

  // Handle submit button click
  const handleSubmit = async (finalTimeTaken) => {
    setIsAttempting(false);
    setIsSubmitted(true);

    let userAnswer;
    if (question.type === "Numerical") {
      userAnswer = numericalAnswer !== "" ? parseFloat(numericalAnswer) : null;
    } else if (question.type === "Single Correct") {
      userAnswer = selectedOptions.length > 0 ? selectedOptions[0] : "";
    } else if (question.type === "Multiple Correct") {
      userAnswer = selectedOptions.length > 0 ? selectedOptions.map((opt) => opt.trim().toUpperCase()) : [];
    }

    console.log("Submitting attempt with:", { userAnswer, finalTimeTaken });

    const attemptData = {
      questionId: question._id,
      userAnswer,
      timeTaken: finalTimeTaken,
    };

    try {
      const response = await fetch(`http://localhost:4000/api/attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(attemptData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to attempt");

      console.log("Attempt recorded:", data);
    } catch (error) {
      console.error("Error submitting attempt:", error);
    }
  };

  return (
    <div className="question-container">
      {/* Header Row: Question ID, Chips, Bookmark, Feedback */}
      <div className="question-header">
        <span className="question-id">QID: {question._id}</span>
        <div className="question-tags">
          <span className="chip">{question.type}</span>
          <span className="chip">{question.chapter}</span>
          <span className="chip">{question.category}</span>
        </div>
        <div className="question-actions">
          <button className="bookmark-btn">🔖</button>
          <button className="feedback-btn">💬</button>
        </div>
      </div>

      {/* Question Image */}
      {question.imageUrl && (
        <div className="question-image">
          <img src={question.imageUrl} alt="Question" />
        </div>
      )}

      {/* Options / Input Field */}
      <div className="question-options">
        {(question.type === "Multiple Correct" || question.type === "Single Correct") && (
          <div className="options-grid">
            {["A", "B", "C", "D"].map((option) => (
              <button
                key={option}
                className={`option-btn ${selectedOptions.includes(option) ? "selected" : ""}`}
                onClick={() => handleOptionSelect(option)}
                disabled={!isAttempting || isSubmitted || isAttempted}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Numerical Input */}
        {question.type === "Numerical" && (
          <input
            type="number"
            className="numerical-input"
            placeholder="Enter your answer"
            value={numericalAnswer}
            onChange={(e) => setNumericalAnswer(e.target.value)}
            disabled={!isAttempting || isSubmitted || isAttempted}
          />
        )}
      </div>

      {/* Attempt/Submit Button & Timer */}
      <div className="question-footer">
        {!isAttempting && !isSubmitted && !isAttempted && (
          <button className="attempt-btn" onClick={handleAttempt} disabled={isAttempted}>
            Attempt
          </button>
        )}
        {isAttempting && !isSubmitted && (
          <button className="submit-btn" onClick={() => setIsAttempting(false)}>
            Submit
          </button>
        )}
        <Timer isRunning={isAttempting} onStop={handleSubmit} />
      </div>
    </div>
  );
};

export default Question;
