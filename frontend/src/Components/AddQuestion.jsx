import { useState } from "react";
import { useAddQuestion } from "../hooks/useAddQuestion";
import chapters from "./Chapters";
import "./AddQuestion.css";

const AddQuestion = () => {
  const { uploadQuestion, loading, error } = useAddQuestion();
  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "",
    chapter: "",
    correctAnswer: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Handle input/select change
  const handleChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prevForm) => ({ ...prevForm, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.chapter || !form.correctAnswer || !form.image) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    const result = await uploadQuestion(formData);
    if (result) {
      alert("Question added successfully!");
      setForm({
        title: "",
        category: "",
        type: "",
        chapter: "",
        correctAnswer: "",
        image: null,
      });
      setImagePreview(null);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="title"
            placeholder="Question ID"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="" disabled>
              Select Category
            </option>
            <option value="JM">JM</option>
            <option value="JA">JA</option>
          </select>
        </div>

        <div className="input-group">
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="" disabled>
              Select Type
            </option>
            <option value="SCQ">SCQ</option>
            <option value="MCQ">MCQ</option>
            <option value="Numerical">Numerical</option>
          </select>
        </div>

        <div className="input-group">
          <select
            name="chapter"
            value={form.chapter}
            onChange={handleChange}
            required
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
        </div>

        <div className="input-group">
          <input
            type="text"
            name="correctAnswer"
            placeholder="Correct Answer"
            value={form.correctAnswer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="file-input-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <button className="Submit-button" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AddQuestion;
