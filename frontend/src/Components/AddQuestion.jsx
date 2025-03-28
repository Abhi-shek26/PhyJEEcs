import { useState } from "react";
import axios from "axios";
import chapters from "./Chapters";
import { useAuthContext } from "../hooks/useAuthContext";
import "./AddQuestion.css";

const AddQuestion = () => {
  const { user } = useAuthContext();
  console.log("User in AddQuestion:", user);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("JEE Mains");
  const [type, setType] = useState("Single Correct");
  const [chapter, setChapter] = useState("");
  const [image, setImage] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", color: "" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      // Create an Image object to get the dimensions
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !chapter || !image || !category || !type || !correctAnswer) {
      setMessage({ text: "Enter all required fields", color: "red" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("type", type);
    formData.append("chapter", chapter);
    formData.append("image", image);
    formData.append("correctAnswer", correctAnswer);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setMessage({ text: "Uploaded successfully!", color: "green" });
      } else {
        setMessage({
          text: "Unexpected response, but uploaded",
          color: "orange",
        });
      }

      setTitle("");
      setChapter("");
      setImage(null);
      setImagePreview(null);
      setImageWidth(0);
      setImageHeight(0);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ text: "Error uploading", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Question ID"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="JEE Mains">JEE Mains</option>
            <option value="JEE Advanced">JEE Advanced</option>
          </select>
        </div>
        <div className="input-group">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Single Correct">Single Correct</option>
            <option value="Multiple Correct">Multiple Correct</option>
            <option value="Numerical">Numerical</option>
          </select>
        </div>
        <div className="input-group">
          <select
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            required
          >
            <option value="">Select Chapter</option>
            {chapters.map((chap, index) => (
              <option key={index} value={chap}>
                {chap}
              </option>
            ))}
          </select>
        </div>

        <div className="file-input-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        {imagePreview && (
          <div
            className="image-preview"
            style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}
          >
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
        <div className="input-group">
          <input
            type="text"
            placeholder="Correct Answer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          />
        </div>

        <button className="Submit-button" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
      {message.text && <p style={{ color: message.color }}>{message.text}</p>}
    </div>
  );
};

export default AddQuestion;
