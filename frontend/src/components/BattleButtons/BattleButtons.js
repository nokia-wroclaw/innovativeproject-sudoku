import "./BattleButtons.scss";
import PropTypes from "prop-types";
import React from "react";
import UIfx from "uifx";

const BattleButtons = ({ downloadNewBoard }) => {
  const stopwatchSound = new UIfx("/sounds/stopwatch.mp3", {
    volume: 0.5, // number between 0.0 ~ 1.0
    throttleMs: 100
  });

  const swordsSound = new UIfx("/sounds/swords.mp3", {
    volume: 0.5, // number between 0.0 ~ 1.0
    throttleMs: 100
  });

  return (
    <div className="BattleButtons">
      <div
        className="bButton bHeal"
        role="button"
        tabIndex="0"
        onClick={() => {
          downloadNewBoard();
          stopwatchSound.play();
        }}
        onKeyDown={downloadNewBoard}
      >
        <img alt="heal" />
      </div>
      <div
        className="bButton bFight"
        role="button"
        tabIndex="0"
        onClick={() => {
          downloadNewBoard();
          swordsSound.play();
        }}
        onKeyDown={downloadNewBoard}
      >
        <img alt="fight" />
      </div>
    </div>
  );
};

BattleButtons.propTypes = {
  downloadNewBoard: PropTypes.func.isRequired
};

export default BattleButtons;
