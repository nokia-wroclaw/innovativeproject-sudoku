import { useState, useEffect } from "react";

const useTimer = startTime => {
  const [timeLeft, setTimeLeft] = useState(startTime);
  const [timeEnd, setTimeEnd] = useState(false);

  const parseTime = time => {
    const progress = Math.floor((time / startTime) * 1000);
    const minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return {
      minutes,
      seconds,
      progress
    };
  };

  useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      setTimeEnd(true);
    }
  }, [timeLeft]);

  return [parseTime(timeLeft), timeEnd];
};

export default useTimer;
