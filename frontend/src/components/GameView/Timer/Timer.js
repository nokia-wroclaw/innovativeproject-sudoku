import React from "react";
import { Line } from "rc-progress";
import PropTypes from "prop-types";
import timer from "./Timer.scss";

export default function Timer({ currentTime, maxTime }) {
  const progress = Math.floor((currentTime / maxTime) * 100);
  const minutes = Math.floor(currentTime / 60);
  let seconds = currentTime - minutes * 60;

  let textColor = timer.white;
  let strokeColor = timer.base;
  const red = "#cc0000";

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  if (currentTime < 30) {
    textColor = red;
    strokeColor = red;
  }

  return (
    <div className="Timer">
      <p style={{ color: textColor }}>
        {minutes}:{seconds}
      </p>
      <Line
        className="progressBar"
        percent={progress}
        strokeWidth="2"
        trailWidth="2"
        strokeColor={strokeColor}
      />
    </div>
  );
}

Timer.propTypes = {
  currentTime: PropTypes.number.isRequired,
  maxTime: PropTypes.number.isRequired
};
