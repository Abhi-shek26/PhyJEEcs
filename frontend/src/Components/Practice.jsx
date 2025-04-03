import { useState } from "react";
import { useFetchQuestions } from "../hooks/useFetchQuestions";
import { useQuestionContext } from "../hooks/useQuestionContext";
import chapters from "./chapters";
import Question from "./Question";
import "./Practice.css";

const Practice = () => {
  
  const { fetchQuestions } = useFetchQuestions();
  const { questions } = useQuestionContext();
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    type: "",
    chapter: "",
  });

  // Check if at least one filter is filled
  const isFilterFilled = Object.values(filters).some(
    (val) => val.trim() !== ""
  );

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFetch = () => {
    fetchQuestions(filters);
  };

  return (
    <div className="practice-container">
      <div className="filter-container">
        <input
          type="text"
          name="title"
          placeholder="Search by Ques. Code"
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
          <option value="JEE Mains">JEE Mains</option>
          <option value="JEE Advanced">JEE Advanced</option>
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
          <option value="Single Correct">Single Correct</option>
          <option value="Multiple Correct">Multiple Correct</option>
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
          Practice
        </button>
      </div>

      <div className="fetched-questions">
        {questions.length > 0 ? (
          questions.map((q) => <Question key={q._id} question={q} />)
        ) : (
          <p>No questions found</p>
        )}
      </div>
    </div>
  );
};

export default Practice;
