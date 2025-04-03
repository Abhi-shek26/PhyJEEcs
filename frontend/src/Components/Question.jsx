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
  const isAttempted = attempts.some(q => q.questionId._id === question._id);

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (question.type === "Single Correct") {
      setSelectedOptions([option]); // Only one selection allowed
    } else if (question.type === "Multiple Correct") {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option) // Deselect if already selected
          : [...prev, option]
      );
    }
  };

  // Handle attempt button click
  const handleAttempt = () => {
    setIsAttempting(true); // Enable options & timer
    setIsSubmitted(false);
  };

  // Handle submit button click
  const handleSubmit = async (finalTimeTaken) => { // Accept time as parameter
    setIsAttempting(false);
    setIsSubmitted(true);

    let userAnswer;
    if (question.type === "Numerical") {
      userAnswer = numericalAnswer !== "" ? parseFloat(numericalAnswer) : null;
    } else if (question.type === "Single Correct") {
      userAnswer = selectedOptions.length > 0 ? selectedOptions[0] : "";
    } else if (question.type === "Multiple Correct") {
      userAnswer = selectedOptions.length > 0 ? selectedOptions.map(opt => opt.trim().toUpperCase()) : [];
    }

    console.log("Submitting attempt with:", { userAnswer, finalTimeTaken });

    const attemptData = {
      questionId: question._id,
      userAnswer,
      timeTaken: finalTimeTaken, // Ensure the correct time is sent
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
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px", margin: "10px" }}>
      <p>{question.title}</p>
      <p>{question.imageUrl}</p>
      <p>{question.type}</p>
      <p>{question.category}</p>
      <p>{question.correctAnswer}</p>
      <p>{question._id}</p>

      {/* Timer Component (Pass time to handleSubmit) */}
      <Timer isRunning={isAttempting} onStop={handleSubmit} />

      {/* Show selection buttons for Multiple Correct & Single Correct */}
      {(question.type === "Multiple Correct" || question.type === "Single Correct") && (
        <div className="options">
          {["A", "B", "C", "D"].map((option) => (
            <button
              key={option}
              className={`option-btn ${selectedOptions.includes(option) ? "selected" : ""}`}
              onClick={() => handleOptionSelect(option)}
              disabled={!isAttempting || isSubmitted || isAttempted} // Disable before attempt & after submission
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Show input field for Numerical Type */}
      {question.type === "Numerical" && (
        <input
          type="number"
          value={numericalAnswer}
          onChange={(e) => setNumericalAnswer(e.target.value)}
          disabled={!isAttempting || isSubmitted || isAttempted} // Disable before attempt & after submission
        />
      )}

      {/* Show Attempt Button (disabled if already attempted) */}
      {!isAttempting && !isSubmitted && !isAttempted && (
        <button onClick={handleAttempt} disabled={isAttempted}>
          Attempt
        </button>
      )}

      {/* Show Submit Button (enabled only during attempt) */}
      {isAttempting && !isSubmitted && (
        <button onClick={() => setIsAttempting(false)}>Submit</button>
      )}

      {/* Show "Attempted" message if already attempted */}
      {isAttempted && <p>Attempted</p>}
    </div>
  );
};

export default Question;
