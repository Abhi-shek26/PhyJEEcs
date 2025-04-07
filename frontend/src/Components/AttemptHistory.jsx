import React, { useState } from "react";
import { useFetchAttempts } from "../hooks/useFetchAttempts";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import "./AttemptHistory.css";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

  return `${day}-${month}-${year} | ${formattedTime}`;
};

const AttemptHistory = () => {
  const { attempts, isLoading } = useFetchAttempts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort attempts by latest attempt first
  const sortedAttempts = [...attempts].sort(
    (a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt)
  );

  const currentAttempt = sortedAttempts[currentIndex];

  return isLoading ? (
    <p className="loadingHistory-text">Loading your attempts...</p>
  ) : !sortedAttempts || sortedAttempts.length === 0 ? (
    <p className="empty-text">No attempts yet. Start practicing!</p>
  ) : (
    <>
      <h2>Your Attempt History</h2>
      <div className="attempt-history">
        <div className="navig-header">
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
            className="navig-btn"
          >
            <GrLinkPrevious />
          </button>

          <span className="navig-text">
            {currentIndex + 1} of {sortedAttempts.length}
          </span>

          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={currentIndex === sortedAttempts.length - 1}
            className="navig-btn"
          >
            <GrLinkNext />
          </button>
        </div>

        <div
          className={`attempt-card ${
            currentAttempt.isCorrect ? "correct" : "incorrect"
          }`}
        >
          <span className="question-title">
            {currentAttempt.questionId?.title || "Question Title"}
          </span>

          <img
            src={currentAttempt.questionId?.imageUrl}
            alt="Attempt Image"
            className="attempt-image"
            onClick={() => setIsModalOpen(true)}
          />

          {isModalOpen && (
            <div className="image-modal" onClick={() => setIsModalOpen(false)}>
              <img
                src={currentAttempt.questionId.imageUrl}
                alt="Enlarged Attempt Image"
                className="modal-image"
              />
            </div>
          )}

          <div className="info-grid">
            <div className="info-box">
              <label>Your Answer</label>
              <span>{currentAttempt.userAnswer}</span>
            </div>
            <div className="info-box">
              <label>Correct Answer</label>
              <span>{currentAttempt.questionId.correctAnswer}</span>
            </div>
            <div
              className={`${
                currentAttempt.isCorrect ? "correct-btn" : "incorrect-btn"
              }`}
            >
              {currentAttempt.isCorrect ? "Correct" : "Incorrect"}
            </div>
            <div className="info-box">
              <label>Time Taken</label>
              <span>{currentAttempt.timeTaken} sec</span>
            </div>
            &nbsp;
            <p className="attempted-on">
              Attempted on: {formatTimestamp(currentAttempt.attemptedAt)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttemptHistory;
