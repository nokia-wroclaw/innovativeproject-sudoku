import React from "react";
import PropTypes from "prop-types";
import colors from "./PlayersList.scss";

const PlayersList = ({ playersLeft, myPosition }) => {
  const playersList = [];

  const createPlayers = () => {
    let backgroundColor;
    for (let i = 0; i < 9; i++) {
      if (i === myPosition) {
        backgroundColor = "yellow";
      } else if (playersLeft > i) {
        backgroundColor = colors.active;
      } else {
        backgroundColor = colors.dead;
      }
      playersList.push(
        <div key={i} className="player" style={{ backgroundColor }} />
      );
    }
    return playersList;
  };

  return <div className="playersList">{createPlayers()}</div>;
};

PlayersList.propTypes = {
  playersLeft: PropTypes.number.isRequired,
  myPosition: PropTypes.number.isRequired
};

export default PlayersList;
