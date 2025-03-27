import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  return { login, isLoading, error };
};
