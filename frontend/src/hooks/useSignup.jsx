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

          if (!response.ok) {
              throw new Error("Signup failed. Try again.");
          }

          const data = await response.json();

          const userData = {
              id: data.id,
              name: data.name,
              email: data.email,
              year: data.year,
              token: data.token,
          };

          localStorage.setItem("user", JSON.stringify(userData));
          dispatch({ type: "LOGIN", payload: userData });

          setIsLoading(false);
          return userData;
      } catch (err) {
          setIsLoading(false);
          setError(err.message);
      }
  };

  return { signup, isLoading, error };
};
