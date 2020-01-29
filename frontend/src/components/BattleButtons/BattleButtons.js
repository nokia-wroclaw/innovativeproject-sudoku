import "./BattleButtons.scss";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Action from "../shared/Action";
import { stopwatchSound, swordsSound } from "../shared/Sounds";

const BattleButtons = ({ setAction, setDisplay }) => {
  const [healSrc, setHealSrc] = useState("/battleButtons/heal.png");
  const [fightSrc, setFightSrc] = useState("/battleButtons/fight.png");

  return (
    <div className="BattleButtons">
      <div
        className="bButton bHeal"
        role="button"
        tabIndex="0"
        onMouseEnter={() => setHealSrc("/battleButtons/heal2.png")}
        onMouseLeave={() => setHealSrc("/battleButtons/heal.png")}
        onClick={() => {
          setAction(Action.HEAL);
          stopwatchSound.play();
          setDisplay(false);
        }}
      >
        <img alt="heal" src={healSrc} />
        <h1>HEAL</h1>
      </div>
      <div
        className="bButton bFight"
        role="button"
        tabIndex="0"
        onMouseEnter={() => setFightSrc("/battleButtons/fight2.png")}
        onMouseLeave={() => setFightSrc("/battleButtons/fight.png")}
        onClick={() => {
          setAction(Action.FIGHT);
          swordsSound.play();
          setDisplay(false);
        }}
      >
        <img alt="fight" src={fightSrc} />
        <h1>ATTACK</h1>
      </div>
    </div>
  );
};

BattleButtons.propTypes = {
  setAction: PropTypes.func.isRequired,
  setDisplay: PropTypes.func.isRequired
};

export default BattleButtons;
