import { useQuestionContext } from "./useQuestionContext";

export const useFetchQuestions = () => {
  const { dispatch } = useQuestionContext();

  const fetchQuestions = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      console.log("Fetching questions with filters:", queryParams); // Debugging output

      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")).token
        : null;
      if (!token) {
        console.error("No auth token found. Please log in.");
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/questions?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📌 API Response:", data);

      dispatch({ type: "SET_QUESTIONS", payload: data });
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return { fetchQuestions };
};
