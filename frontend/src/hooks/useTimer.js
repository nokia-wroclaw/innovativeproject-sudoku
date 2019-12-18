import { useState, useEffect } from "react";

const useTimer = startTime => {
  const [timeLeft, setTimeLeft] = useState(startTime);
  const [timeEnd, setTimeEnd] = useState(false);

  const parseTime = time => {
    const progress = Math.floor((time / startTime) * 100);
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
    if (timeLeft === 0) {
      setTimeEnd(true);
    }
  }, [timeLeft]);

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

  return [
    parseTime(timeLeft),
    newValue => setTimeLeft(timeLeft + newValue),
    timeEnd
  ];
};

export default useTimer;
