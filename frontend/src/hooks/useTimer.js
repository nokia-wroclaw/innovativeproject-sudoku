import { useState, useEffect } from "react";

const useTimer = startTime => {
  const [timeLeft, setTimeLeft] = useState(startTime);

  const parseTime = time => {
    const minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return {
      minutes,
      seconds
    };
  };

  useEffect(() => {
    const interval = setInterval(
      () =>
        setTimeLeft(currentTimeLeft =>
          currentTimeLeft > 0 ? currentTimeLeft - 1 : 0
        ),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  return [parseTime(timeLeft), newValue => setTimeLeft(newValue)];
};

export default useTimer;
