import { useState } from "react";
import { useFetchQuestions } from "../hooks/useFetchQuestions";
import { useQuestionContext } from "../hooks/useQuestionContext";
import chapters from "./chapters";
import Question from "./Question"; 

const Practice = () => {
  const { fetchQuestions } = useFetchQuestions();
  const { questions } = useQuestionContext();
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    type: "",
    chapter: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFetch = () => {
    fetchQuestions(filters);
  };

  return (
    <div>
      <h1>Practice</h1>
      <div>
        <h2>Filter Questions</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />
        <select name="category" onChange={handleChange} defaultValue="">
          <option value="">Select Category</option>
          <option value="JEE Mains">JEE Mains</option>
          <option value="JEE Advanced">JEE Advanced</option>
        </select>
        <select name="type" onChange={handleChange} defaultValue="">
          <option value="">Select Type</option>
          <option value="Single Correct">Single Correct</option>
          <option value="Multiple Correct">Multiple Correct</option>
          <option value="Numerical">Numerical</option>
        </select>
        <select name="chapter" onChange={handleChange} defaultValue="">
          <option value="">Select Chapter</option>
          {chapters.map((chapter, index) => (
            <option key={index} value={chapter}>
              {chapter}
            </option>
          ))}
        </select>
        <button onClick={handleFetch}>Fetch Questions</button>

        <h2>Fetched Questions</h2>
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
