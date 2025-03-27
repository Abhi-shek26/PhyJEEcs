import React, { useState } from "react";
import { CiBookmarkPlus } from "react-icons/ci";
import { MdFeedback } from "react-icons/md";
import Timer from "./Timer";
import "./Question.css";

const Question = ({ question }) => {
  if (!question || Object.keys(question).length === 0) {
    return <p className="loading-message">Loading question...</p>;
  }

  const [attemptStarted, setAttemptStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(
    question.type === "Multiple Correct" ? [] : ""
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
        <span className="question-id">{question.title || "N/A"}</span>
        <div className="chips">
          <span className="chip">{question.chapter || "Unknown Chapter"}</span>
          <span className="chip">{question.category || "Unknown Level"}</span>
          <span className="chip">{question.type || "Unknown Type"}</span>
        </div>
        <div className="options">
          <span className="bookmark">
            <CiBookmarkPlus />
          </span>
          <span className="feedback">
            <MdFeedback />
          </span>
        </div>
      </div>

      {question.imageUrl && (
        <>
          <div
            className="question-image"
            onClick={() => setImageExpanded(true)}
          >
            <img src={question.imageUrl} alt="Question" />
          </div>

          {imageExpanded && (
            <div
              className="image-modal"
              onClick={() => setImageExpanded(false)}
            >
              <div className="image-modal-content">
                <img src={question.imageUrl} alt="Expanded Question" />
              </div>
            </div>
          )}
        </>
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
        {question.type === "Single Correct" ||
        question.type === "Multiple Correct" ? (
          <div className="mcq-options">
            {["A", "B", "C", "D"].map((option, index) => (
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
        ) : question.type === "Numerical" ? (
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
        ) : null}
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
            Time Taken:{" "}
            <strong>{timeTaken ? `${timeTaken} sec` : "N/A"}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default Question;
