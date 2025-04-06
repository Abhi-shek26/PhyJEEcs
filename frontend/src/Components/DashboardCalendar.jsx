import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import { useFetchAttempts } from "../hooks/useFetchAttempts";
import "react-calendar/dist/Calendar.css";
import "./DashboardCalendar.css";

const DashboardCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { attempts } = useFetchAttempts();

  const attemptDataByDate = useMemo(() => {
    const data = {};

    attempts.forEach((attempt) => {
      const dateStr = new Date(attempt.attemptedAt).toDateString();

      if (!data[dateStr]) {
        data[dateStr] = { total: 0, correct: 0, incorrect: 0 };
      }

      data[dateStr].total += 1;
      if (attempt.isCorrect) {
        data[dateStr].correct += 1;
      } else {
        data[dateStr].incorrect += 1;
      }
    });

    return data;
  }, [attempts]);

  const onChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="calendar-wrapper">
      <h4> Calendar</h4>
      <Calendar
        onChange={onChange}
        value={selectedDate}
        tileContent={({ date }) => {
          const dateStr = date.toDateString();
          const data = attemptDataByDate[dateStr];
        
          return data ? (
            <div className="tooltip-wrapper">
              <div className="indicator-dot" ></div>
              <div className="tooltip">
                <strong>{dateStr}</strong>
                <p>📝 {data.total} attempted</p>
                <p>✅ {data.correct} correct</p>
                <p>❌ {data.incorrect} incorrect</p>
              </div>
            </div>
          ) : null;
        }}
        
      />
    </div>
  );
};

export default DashboardCalendar;
