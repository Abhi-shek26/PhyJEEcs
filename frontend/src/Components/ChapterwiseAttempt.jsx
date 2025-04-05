import React, { useEffect, useState } from "react";
import { useFetchQuestions } from "../hooks/useFetchQuestions";
import { useQuestionContext } from "../hooks/useQuestionContext";
import { useFetchAttempts } from "../hooks/useFetchAttempts";
import chapters from "./chapters";
import "./ChapterwiseAttempt.css";

const ChapterwiseAttempt = () => {
  const { questions } = useQuestionContext();
  const { fetchQuestions } = useFetchQuestions();
  const { attempts, isLoading: loadingAttempts } = useFetchAttempts();
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoadingQuestions(true);
      await fetchQuestions({});
      setLoadingQuestions(false);
    };
    loadQuestions();
  }, []);

  if (loadingQuestions || loadingAttempts) return <p>Loading chapter stats...</p>;

  const chapterStats = chapters.map((chapter) => {
    const jmQuestions = questions.filter(
      (q) => q.chapter === chapter && q.category === "JM"
    );
    const jaQuestions = questions.filter(
      (q) => q.chapter === chapter && q.category === "JA"
    );

    const jmAttempts = attempts.filter(
      (a) => a.questionId?.chapter === chapter && a.questionId?.category === "JM"
    );
    const jaAttempts = attempts.filter(
      (a) => a.questionId?.chapter === chapter && a.questionId?.category === "JA"
    );

    return {
      chapter,
      JM: { total: jmQuestions.length, attempted: jmAttempts.length },
      JA: { total: jaQuestions.length, attempted: jaAttempts.length },
    };
  });

  return (
    <div className="chapterwise-container">
      <h2 className="chapterwise-title">Chapter-wise Progress</h2>
      <div className="chapter-grid">
      {chapterStats.map(({ chapter, JM, JA }, index) => (
        <div key={index} className="chapter-card">
          <div className="chapter-name"> {chapter}</div>
          <div className="attempt-section">
          <div className="attempt-row">
            <span className="exam-label">JEE Mains</span>
            <div className="attempt-box">{JM.attempted}/{JM.total}</div>
          </div>
          <div className="attempt-row">
            <span className="exam-label">JEE Adv.</span>
            <div className="attempt-box">{JA.attempted}/{JA.total}</div>
          </div>
        </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default ChapterwiseAttempt;
