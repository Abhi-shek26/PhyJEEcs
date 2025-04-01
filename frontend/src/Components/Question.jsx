import React, { useState } from "react";
import "./Question.css";
import { useFetchAttempts } from "../hooks/useFetchAttempts";
import { useAuthContext } from "../hooks/useAuthContext";

const Question = ({ question }) => {
  const { user } = useAuthContext();
 const { attempts } = useFetchAttempts();

 console.log(attempts);
  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px", margin: "10px" }}>
      <p>{question.title}</p>
      <p>{question.imageUrl}</p>
      <p>{question.type}</p>
      <p>{question.category}</p>
      <p>{question.correctAnswer}</p>
      <p>{question._id}</p>
      {attempts.some(q => q.questionId._id === question._id) ? "Attempted" : 
  <button 
    onClick={async () => { 
      const attemptData = {
        questionId: question._id,
        userAnswer: "D", 
        timeTaken: 30, 
      };

      try {
        const response = await fetch(`http://localhost:4000/api/attempt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(attemptData), 
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to attempt");
        
        console.log("Attempt recorded:", data); 

      } catch (error) {
        console.error("Error submitting attempt:", error);
      }
    }}
  >
    Attempt
  </button>
}
    </div>
  );
};

export default Question;
