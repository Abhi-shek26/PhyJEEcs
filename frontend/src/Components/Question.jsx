import React, { useState } from "react";
import { CiBookmarkPlus } from "react-icons/ci";
import { MdFeedback } from "react-icons/md";
import Timer from "./Timer";
import "./Question.css"; 

const question = {
  id: "KMJM1",
  chapter: "Kinematics",
  level: "JEE Mains",
  type: "Multiple Correct", // Change to "Single Correct" or "Numerical" for testing
  image:
    "https://res.cloudinary.com/dubavyoxd/image/upload/v1742898758/Questions/2.KinematicsJEE%20Mains/Multiple%20Correct/qcezhvvbrfgcial9lzlr.png",
  options: ["A", "B", "C", "D"],
};

const Question = () => {
  const [attemptStarted, setAttemptStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(
    question.type === "Multiple Correct" ? [] : null
  ); 
  const [submittedAnswer, setSubmittedAnswer] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);

  const startAttempt = () => {
    setAttemptStarted(true);
    setTimerRunning(true);
  };

  const handleSubmit = () => {
    setAttemptStarted(false);
    setTimerRunning(false);
    setSubmittedAnswer(selectedAnswer);
  };

  const toggleOption = (option) => {
    if (!attemptStarted || submittedAnswer !== null) return;

    if (question.type === "Multiple Correct") {
      setSelectedAnswer((prev) =>
        prev.includes(option)
          ? prev.filter((ans) => ans !== option)
          : [...prev, option]
      );
    } else if (question.type === "Single Correct") {
      setSelectedAnswer(option);
    }
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <span className="question-id">{question.id}</span>
        <div className="chips">
          <span className="chip">{question.chapter}</span>
          <span className="chip">{question.level}</span>
          <span className="chip">{question.type}</span>
        </div>
        <div className="options">
          <span className="bookmark"><CiBookmarkPlus /></span>
          <span className="feedback"><MdFeedback /></span>
        </div>
      </div>

      <div className="question-image" onClick={() => setImageExpanded(true)}>
        <img src={question.image} alt="Question" />
      </div>

      {imageExpanded && (
        <div className="image-modal" onClick={() => setImageExpanded(false)}>
          <div className="image-modal-content">
            <img src={question.image} alt="Expanded Question" />
          </div>
        </div>
      )}

      <div className="timer-box">
        {attemptStarted && (
          <Timer
            start={timerRunning}
            stop={!timerRunning}
            onTimeUpdate={setTimeTaken}
          />
        )}
      </div>

      <div className="options-container">
        {question.type === "Single Correct" || question.type === "Multiple Correct" ? (
          <div className="mcq-options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  question.type === "Multiple Correct"
                    ? selectedAnswer.includes(option) 
                      ? "selected"
                      : ""
                    : selectedAnswer === option 
                    ? "selected"
                    : ""
                }`}
                onClick={() => toggleOption(option)}
                disabled={!attemptStarted || submittedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            className="numerical-input"
            placeholder="Enter your answer"
            value={selectedAnswer || ""}
            onChange={(e) =>
              attemptStarted && setSelectedAnswer(e.target.value)
            }
            disabled={!attemptStarted || submittedAnswer !== null}
          />
        )}
      </div>

      <div className="buttons">
        <button
          onClick={startAttempt}
          disabled={attemptStarted || submittedAnswer !== null}
          className="attempt-btn"
        >
          Attempt Question
        </button>
        <button
          onClick={handleSubmit}
          disabled={!attemptStarted}
          className="submit-btn"
        >
          Submit
        </button>
      </div>

      {submittedAnswer !== null && (
        <div className="result">
          <p>
            Submitted Answer:{" "}
            <strong>
              {Array.isArray(submittedAnswer)
                ? submittedAnswer.join(", ")
                : submittedAnswer}
            </strong>
          </p>
          <p>
            Time Taken: <strong>{timeTaken ? `${timeTaken} sec` : "N/A"}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default Question;
