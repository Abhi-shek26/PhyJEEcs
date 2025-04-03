import { useState, useEffect } from "react";

const Timer = ({ isRunning, onStop }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      setTime(0); // Reset timer on new attempt
      timer = setInterval(() => setTime(prev => prev + 1), 1000);
    } else if (time > 0) { // Ensure we only send valid times
      clearInterval(timer);
      onStop(time); // Send final time when stopping
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  return <p>Time: {time}s</p>;
};

export default Timer;
