import { useState } from "react";
import { useFetchQuestions } from "../hooks/useFetchQuestions";
import { useQuestionContext } from "../hooks/useQuestionContext";
import { useFetchAttempts } from "../hooks/useFetchAttempts";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import chapters from "./chapters";
import Question from "./Question";
import "./Practice.css";

const Practice = () => {
  const { fetchQuestions } = useFetchQuestions();
  const { questions } = useQuestionContext();
  const { attempts } = useFetchAttempts();
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    type: "",
    chapter: "",
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const isFilterFilled = Object.values(filters).some(
    (val) => val.trim() !== ""
  );

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFetch = () => {
    fetchQuestions(filters);
    setCurrentIndex(0);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="practice-container">
      <div className="filter-container">
        <input
          type="text"
          name="title"
          placeholder=" Ques. Code"
          onChange={handleChange}
          className="filter-input"
        />

        <select
          name="category"
          onChange={handleChange}
          defaultValue=""
          className="filter-select"
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="JM">JM</option>
          <option value="JA">JA</option>
        </select>

        <select
          name="type"
          onChange={handleChange}
          defaultValue=""
          className="filter-select"
        >
          <option value="" disabled>
            Select Type
          </option>
          <option value="SCQ">SCQ</option>
          <option value="MCQ">MCQ</option>
          <option value="Numerical">Numerical</option>
        </select>

        <select
          name="chapter"
          onChange={handleChange}
          defaultValue=""
          className="filter-select"
        >
          <option value="" disabled>
            Select Chapter
          </option>
          {chapters.map((chapter, index) => (
            <option key={index} value={chapter}>
              {chapter}
            </option>
          ))}
        </select>

        <button
          onClick={handleFetch}
          disabled={!isFilterFilled}
          className="filter-button"
        >
          Search
        </button>
      </div>

      <div className="fetched-questions">
        {questions.length > 0 ? (
          <>
            <div
              className="question-count"
              style={{ textAlign: "center", marginTop: "0.5rem" }}
            >
               {currentIndex +1} of {questions.length}
            </div>
            <div
              className="navigation-buttons"
              style={{ marginTop: "1rem", textAlign: "center", marginBottom: "1rem" }}
            >
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="prev-btn"
                style={{ marginRight: "10px" }}
              >
                <GrLinkPrevious />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="next-btn"
              >
                <GrLinkNext />
              </button>
            </div>
            <Question question={questions[currentIndex]} attempts={attempts} />
          </>
        ) : (
          <p>No questions found</p>
        )}
      </div>
    </div>
  );
};

export default Practice;
