import React, { useState, useEffect } from "react";
import "./Question.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { BiBookmarkPlus, BiBookmark } from "react-icons/bi";
import { MdOutlineFeedback } from "react-icons/md";
import Timer from "./Timer";

const API = import.meta.env.VITE_API_URL;

async function readJsonSafe(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      res.status === 404
        ? "Feature not on server yet — redeploy backend (this API returns 404 HTML)."
        : `Server error (${res.status}).`
    );
  }
}

const Question = ({ question, attempts = [] }) => {
  const { user } = useAuthContext();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [numericalAnswer, setNumericalAnswer] = useState("");
  const [isAttempting, setIsAttempting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Handles misbehavior on navigation
  const [bookmarked, setBookmarked] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [solution, setSolution] = useState(null);

  // Reset local states when new question loads
  useEffect(() => {
    setSelectedOptions([]);
    setNumericalAnswer("");
    setIsAttempting(false);
    setIsSubmitted(false);
    setHasSubmitted(false);
    setSolution(null);
    setShowFeedback(false);
    setActionMsg("");
  }, [question._id]);

  // Load persisted bookmark state so icon reflects reality on reload
  useEffect(() => {
    if (!user || !question?._id) return;
    fetch(`${API}/api/bookmarks`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(readJsonSafe)
      .then((d) => {
        const list = Array.isArray(d) ? d : [];
        setBookmarked(list.some((b) => (b.questionId?._id || b.questionId) === question._id));
      })
      .catch(() => {});
  }, [user, question._id]);

  const toggleBookmark = async () => {
    setActionMsg("");
    try {
      const res = await fetch(`${API}/api/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ questionId: question._id }),
      });
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to bookmark");
      setBookmarked(!!data.bookmarked);
      setActionMsg(data.bookmarked ? "Bookmarked ✓" : "Bookmark removed");
    } catch (e) {
      setActionMsg(e.message);
    }
  };

  const submitFeedback = async () => {
    setActionMsg("");
    try {
      const res = await fetch(`${API}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ questionId: question._id, rating: Number(rating), text: feedbackText }),
      });
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to send feedback");
      setShowFeedback(false);
      setFeedbackText("");
      setActionMsg("Feedback sent ✓");
    } catch (e) {
      setActionMsg(e.message);
    }
  };

  const fetchSolution = async () => {
    setActionMsg("");
    try {
      const res = await fetch(`${API}/api/explain/${question._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to load solution");
      setSolution(data.solution || data.prompt || "No solution yet.");
    } catch (e) {
      setActionMsg(e.message);
    }
  };

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
      const response = await fetch(`${API}/api/attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(attemptData),
      });

      const data = await readJsonSafe(response);
      if (!response.ok) throw new Error(data.error || "Failed to attempt");
      console.log("Attempt recorded:", data);
    } catch (error) {
      setActionMsg(error.message);
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
          <button className="bookmark-btn" onClick={toggleBookmark} title={bookmarked ? "Remove bookmark" : "Bookmark"}>
            {bookmarked ? <BiBookmark color="#1a73e8" /> : <BiBookmarkPlus />}
          </button>
          <button className="feedback-btn" onClick={() => setShowFeedback((s) => !s)} title="Feedback">
            <MdOutlineFeedback />
          </button>
          <button className="feedback-btn" onClick={fetchSolution} title="Solution / Explain">
            ?
          </button>
        </div>
      </div>
      {actionMsg && (
        <div className="attempt-summary">
          <p>{actionMsg}</p>
        </div>
      )}

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
      {showFeedback && (
        <div className="attempt-summary">
          <p><strong>Rate this question (1-5)</strong></p>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="numerical-input"
          />
          <input
            type="text"
            placeholder="Feedback (optional)"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="numerical-input"
          />
          <button className="attempt-btn" onClick={submitFeedback}>Send feedback</button>
        </div>
      )}
      {solution && (
        <div className="attempt-summary">
          <p><strong>Solution / Explanation:</strong></p>
          <p>{solution}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
