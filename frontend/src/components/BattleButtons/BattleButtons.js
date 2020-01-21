import "./BattleButtons.scss";
import PropTypes from "prop-types";
import React from "react";

const BattleButtons = ({ downloadNewBoard }) => {
  return (
    <div className="BattleButtons">
      <div
        className="bButton bHeal"
        role="button"
        tabIndex="0"
        onClick={downloadNewBoard}
        onKeyDown={downloadNewBoard}
      >
        <img alt="heal" />
      </div>
      <div
        className="bButton bFight"
        role="button"
        tabIndex="0"
        onClick={downloadNewBoard}
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
