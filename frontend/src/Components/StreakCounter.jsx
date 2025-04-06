import React, { useMemo } from "react";
import { useFetchAttempts } from "../hooks/useFetchAttempts";

const StreakCounter = () => {
  const { attempts, isLoading } = useFetchAttempts();

  const streak = useMemo(() => {
    if (!attempts || attempts.length === 0) return 0;

    const dateSet = new Set(
      attempts.map((a) =>
        new Date(a.attemptedAt).toLocaleDateString("en-CA")
      )
    );

    const today = new Date();
    let streakCount = 0;

    for (let i = 0; ; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toLocaleDateString("en-CA");

      if (dateSet.has(key)) {
        streakCount++;
      } else {
        break;
      }
    }

    return streakCount;
  }, [attempts]);

  if (isLoading) return <p>Loading your streak... 🔄</p>;

  return (
    <div className="streak-counter">
      <p>
        You’re on a <strong>{streak}</strong> day streak! 🔥
      </p>
    </div>
  );
};

export default StreakCounter;
