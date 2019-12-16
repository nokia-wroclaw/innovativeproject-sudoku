import React from "react";
import { Line } from "rc-progress";
import PropTypes from "prop-types";
import timer from "./Timer.scss";
import useTimer from "../../../hooks/useTimer";

export default function Timer({ start, gameEndCallback }) {
  const [timeLeft, gameEnd] = useTimer(start);

  const { progress, minutes, seconds } = timeLeft;

  let timerColor = timer.timer;

  if (minutes === 0 && seconds < 30) {
    timerColor = "#cc0033";
  }

  if (gameEnd) {
    gameEndCallback();
  }

  return (
    <div className="Timer">
      <p style={{ color: timerColor }}>
        {minutes}:{seconds}
      </p>
      <Line
        className="progressBar"
        percent={progress}
        strokeWidth="2"
        trailWidth="2"
        strokeColor={timerColor}
      />
    </div>
  );
}

Timer.propTypes = {
  start: PropTypes.number.isRequired,
  gameEndCallback: PropTypes.func.isRequired
};
