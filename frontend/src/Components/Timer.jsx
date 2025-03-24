import { useEffect, useState } from "react";

const Timer = ({ start, stop, onTimeUpdate }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (start && !stop) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          onTimeUpdate(newTime); // Pass updated time
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup on unmount
  }, [start, stop, onTimeUpdate]);

  return <div>Time: {time}s</div>;
};

export default Timer;
