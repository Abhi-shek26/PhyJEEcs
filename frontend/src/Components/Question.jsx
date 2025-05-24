import React, { useState, useEffect } from "react";
import "./Question.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { BiBookmarkPlus } from "react-icons/bi";
import { MdOutlineFeedback } from "react-icons/md";
import Timer from "./Timer";

const Question = ({ question, attempts = [] }) => {
  const { user } = useAuthContext();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [numericalAnswer, setNumericalAnswer] = useState("");
  const [isAttempting, setIsAttempting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Handles misbehavior on navigation

  // Reset local states when new question loads
  useEffect(() => {
    setSelectedOptions([]);
    setNumericalAnswer("");
    setIsAttempting(false);
    setIsSubmitted(false);
    setHasSubmitted(false);
  }, [question._id]);

  const currentAttempt = (attempts || []).find(
    (q) => q.questionId._id === question._id
  );
  const isAttempted = !!currentAttempt;

  const handleOptionSelect = (option) => {
    if (question.type === "SCQ") {
      setSelectedOptions([option]);
    } else if (question.type === "MCQ") {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
      );
    }
  };

  const handleAttempt = () => {
    setIsAttempting(true);
    setIsSubmitted(false);
    setHasSubmitted(false);
  };

  const handleSubmit = async (finalTimeTaken) => {
    if (hasSubmitted) return; // prevent re-submit on navigating back
    setIsAttempting(false);
    setIsSubmitted(true);
    setHasSubmitted(true);

    let userAnswer;
    if (question.type === "Numerical") {
      userAnswer = numericalAnswer !== "" ? parseFloat(numericalAnswer) : null;
    } else if (question.type === "SCQ") {
      userAnswer = selectedOptions.length > 0 ? selectedOptions[0] : "";
    } else if (question.type === "MCQ") {
      userAnswer =
        selectedOptions.length > 0
          ? selectedOptions.map((opt) => opt.trim().toUpperCase())
          : [];
    }

    const attemptData = {
      questionId: question._id,
      userAnswer,
      timeTaken: finalTimeTaken,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempt`, {
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
      <div className="question-header">
        <span className="question-id">{question.title}</span>
        <div className="question-tags">
          <span className="chip">{question.type}</span>
          <span className="chip">{question.chapter}</span>
          <span className="chip">{question.category}</span>
        </div>
        <div className="question-actions">
          <button className="bookmark-btn">
            <BiBookmarkPlus />
          </button>
          <button className="feedback-btn">
            <MdOutlineFeedback />
          </button>
        </div>
      </div>

      {question.imageUrl && (
        <div className="question-image">
          <img
            src={question.imageUrl}
            alt="Question"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      )}
      {isModalOpen && (
        <div className="image-modal" onClick={() => setIsModalOpen(false)}>
          <img
            src={question.imageUrl}
            alt="Enlarged"
            className="modal-image"
          />
        </div>
      )}

      <div className="question-options">
        {!isAttempted && (question.type === "MCQ" || question.type === "SCQ") && (
          <div className="options-grid">
            {["A", "B", "C", "D"].map((option) => (
              <button
                key={option}
                className={`option-btn ${
                  selectedOptions.includes(option) ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(option)}
                disabled={!isAttempting || isSubmitted}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {!isAttempted && question.type === "Numerical" && (
          <input
            type="number"
            className="numerical-input"
            placeholder="Enter your answer"
            value={numericalAnswer}
            onChange={(e) => setNumericalAnswer(e.target.value)}
            disabled={!isAttempting || isSubmitted}
          />
        )}

        {isAttempted && (
          <div className="attempt-summary">
            <p>
              <strong>Your Answer:</strong>{" "}
              {Array.isArray(currentAttempt.userAnswer)
                ? currentAttempt.userAnswer.join(", ")
                : currentAttempt.userAnswer}
            </p>
            <p>
              <strong>Correct Answer:</strong>{" "}
              {Array.isArray(question.correctAnswer)
                ? question.correctAnswer.join(", ")
                : question.correctAnswer}
            </p>
            <p>
              <strong>Time Taken:</strong> {currentAttempt.timeTaken} sec
            </p>
            <p>
              <strong>Result:</strong>{" "}
              {currentAttempt.isCorrect ? "Correct ✅" : "Incorrect ❌"}
            </p>
          </div>
        )}
      </div>

      <div className="question-footer">
        {!isAttempting && !isSubmitted && !isAttempted && (
          <button className="attempt-btn" onClick={handleAttempt}>
            Attempt
          </button>
        )}
        {isAttempting && !isSubmitted && !isAttempted && (
          <button className="submit-btn" onClick={() => setIsAttempting(false)}>
            Submit
          </button>
        )}
        {!isAttempted && !isSubmitted && (
          <Timer isRunning={isAttempting} onStop={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default Question;
