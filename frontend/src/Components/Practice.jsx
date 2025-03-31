import { useState } from "react";
import { useFetchQuestions } from "../hooks/useFetchQuestions";
import { useQuestionContext } from "../hooks/useQuestionContext";
import chapters from "./Chapters";

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
    // console.log("Fetching with filters:", filters); // Log filters before fetching
    fetchQuestions(filters);
  };

  // console.log("📌 Questions in state:", questions); //  Log questions from context

  return (
    <div>
      <h1>Practice</h1>
      <hr />
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
        <ul>
          {questions.length > 0 ? (
            questions.map((q) => 
              <li key={q._id}>
                <h3>{q.title}</h3>
                <p>Category: {q.category}</p>
                <p>Type: {q.type}</p>
                <p>Chapter: {q.chapter}</p>
                <p>Question: {q.imageUrl}</p>
                <p>Answer: {q.correctAnswer}</p>
              </li>
            )
          ) : (
            <p>No questions found</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Practice;
