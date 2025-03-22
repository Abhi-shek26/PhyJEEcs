import { useState } from "react";
import axios from "axios";

const AddQuestion = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("JEE Mains");
  const [type, setType] = useState("Single Correct");
  const [chapter, setChapter] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !chapter || !image) {
      setMessage("Please fill all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("type", type);
    formData.append("chapter", chapter);
    formData.append("image", image);

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:4000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Question added successfully!");
      setTitle("");
      setChapter("");
      setImage(null);
    } catch (error) {
      setMessage("Error uploading question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="JEE Mains">JEE Mains</option>
          <option value="JEE Advanced">JEE Advanced</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Single Correct">Single Correct</option>
          <option value="Multiple Correct">Multiple Correct</option>
          <option value="Numerical">Numerical</option>
        </select>
        <input
          type="text"
          placeholder="Chapter"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddQuestion;
