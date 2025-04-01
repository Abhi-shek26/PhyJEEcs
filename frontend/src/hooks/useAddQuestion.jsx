import { useState } from "react";
import { useQuestionContext } from "./useQuestionContext";

export const useAddQuestion = () => {
  const { addQuestion } = useQuestionContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadQuestion = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // FormData automatically sets the correct `Content-Type`
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload question");
      }

      // Add the new question to the context
      addQuestion(data.question);

      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { uploadQuestion, loading, error };
};
