import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

export const useFetchAttempts = () => {
  const { user } = useAuthContext();
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchAttempts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        console.log( "Fetched attempts data:", data);
        
        if (!response.ok) throw new Error(data.error || "Failed to fetch attempts");

        setAttempts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttempts();
  }, [user]);

  return { attempts, isLoading };
};
