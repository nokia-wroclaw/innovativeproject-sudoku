import "./BattleButtons.scss";
import PropTypes from "prop-types";
import React from "react";
import Action from "../shared/Action";
import { stopwatchSound, swordsSound } from "../shared/Sounds";

const BattleButtons = ({ setAction, setDisplay }) => {
  return (
    <div className="BattleButtons">
      <div
        className="bButton bHeal"
        role="button"
        tabIndex="0"
        onKeyDown={() => stopwatchSound.play()}
        onClick={() => {
          setAction(Action.HEAL);
          setDisplay(false);
        }}
      >
        <img alt="heal" />
      </div>
      <div
        className="bButton bFight"
        role="button"
        tabIndex="0"
        onKeyDown={() => swordsSound.play()}
        onClick={() => {
          setAction(Action.FIGHT);
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
