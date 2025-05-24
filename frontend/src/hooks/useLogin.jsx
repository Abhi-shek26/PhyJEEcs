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
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
              throw new Error("Invalid email or password");
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

  return { login, isLoading, error };
};
