import "./BattleButtons.scss";
import PropTypes from "prop-types";
import React from "react";
import UIfx from "uifx";
import { ACTION } from "../Board/Board";

const BattleButtons = ({ setAction, setDisplay }) => {
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
          setAction(ACTION.HEAL);
          stopwatchSound.play();
          setDisplay(false);
        }}
      >
        <img alt="heal" />
      </div>
      <div
        className="bButton bFight"
        role="button"
        tabIndex="0"
        onClick={() => {
          setAction(ACTION.FIGHT);
          swordsSound.play();
          setDisplay(false);
        }}
      >
        <img alt="fight" />
      </div>
    </div>
  );
};

BattleButtons.propTypes = {
  setAction: PropTypes.func.isRequired,
  setDisplay: PropTypes.func.isRequired
};

export default BattleButtons;
