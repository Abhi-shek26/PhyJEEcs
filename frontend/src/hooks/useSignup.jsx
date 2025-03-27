import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (name, email, password, confirmPassword, year) => {
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setIsLoading(false);
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, year }),
      });

      let data = {};
      if (response.headers.get("content-type")?.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Save user to local storage
      localStorage.setItem("user", JSON.stringify(data));

      // Update auth context
      dispatch({ type: "LOGIN", payload: data });

      setIsLoading(false);
      return data; // Returning user data for further processing if needed
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  return { signup, isLoading, error };
};
