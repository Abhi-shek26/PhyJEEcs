import React, { useState } from "react";
import "./Question.css";

const Question = ({ question }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleImage = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <span className="question-id">{question.title}</span>
        <div className="chips">
          <span key={question._id} className="chip">
            {question.chapter}
          </span>
          <span key={question._id + 1} className="chip">
            {question.category}
          </span>
          <span key={question._id + 2} className="chip">
            {question.type}
          </span>
        </div>
        <div className="icons">
          <span className="icon">🔖</span>
          <span className="icon">💬</span>
        </div>
      </div>

      <div className="question-image-container" onClick={toggleImage}>
        <img
          src={question.imageUrl}
          alt="Question"
          className={`question-image ${expanded ? "expanded" : ""}`}
        />
      </div>

      <div className="options-container">
        {question.type === "Single Correct" ||
        question.type === "Multiple Correct" ? (
          <>
            <div key="A" className="option">
              A
            </div>
            <div key="B" className="option">
              B
            </div>
            <div key="C" className="option">
              C
            </div>
            <div key="D" className="option">
              D
            </div>
          </>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter your answer"
              className="answer-input"
            />
          </div>
        )}
      </div>

      <div className="bottom-bar">
        <button className="attempt-button">Attempt</button>
        <span className="timer">Time Left: 01:30</span>
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
};

export default Question;
