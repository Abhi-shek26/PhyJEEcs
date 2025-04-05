import React, { useMemo } from "react";
import { useFetchAttempts } from "../hooks/useFetchAttempts";

const StreakCounter = () => {
  const { attempts } = useFetchAttempts();

  const streak = useMemo(() => {
    const dateSet = new Set(
      attempts.map((a) =>
        new Date(a.attemptedAt).toLocaleDateString("en-CA") // yyyy-mm-dd
      )
    );

    const today = new Date();
    let currentStreak = 0;

    for (let i = 0; ; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toLocaleDateString("en-CA");

      if (dateSet.has(key)) currentStreak++;
      else break;
    }

    return currentStreak;
  }, [attempts]);

  return (
    <div className="streak-counter">
      <p>You’re on a <strong>{streak}</strong> day streak! 🔥</p>
    </div>
  );
};

export default StreakCounter;
