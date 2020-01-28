import React from "react";
import PropTypes from "prop-types";
import colors from "./PlayersList.scss";

const PlayersList = ({ myPosition, playersStartAmount, playersLeft }) => {
  console.log({
    myPosition,
    playersStartAmount,
    playersLeft
  });

  const playersList = [];

  const parseTime = time => {
    const minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return { minutes, seconds };
  };

  const createPlayers = () => {
    for (let i = 0; i < playersStartAmount; i++) {
      let backgroundColor;
      let { usernameColor } = colors;
      let timeColor = colors.backgroundColor;

      if (i < playersLeft.length) {
        if (i === 0) {
          backgroundColor = "gold";
        } else if (i === myPosition) {
          timeColor = colors.bWhite;
          backgroundColor = colors.active;
        } else {
          backgroundColor = colors.worsePlayer;
        }
      } else {
        backgroundColor = colors.dead;
        usernameColor = colors.dead;
        timeColor = colors.dead;
      }

      const time =
        i < playersLeft.length
          ? i === myPosition
            ? "YOU"
            : `${parseTime(playersLeft[i].time_left).minutes}:${
                parseTime(playersLeft[i].time_left).seconds
              }`
          : " ";

      const username =
        i === myPosition || i >= playersLeft.length
          ? ""
          : playersLeft[i].username;

      playersList.push(
        <div className="player">
          <div
            key={i}
            className="avatar"
            style={{ backgroundColor, color: timeColor }}
          >
            <p className="time">{time}</p>
          </div>
          <p className="username" style={{ color: usernameColor }}>
            {username}
          </p>
        </div>
      );
    }
    return playersList;
  };

  return <div className="playersList">{createPlayers()}</div>;
};

PlayersList.propTypes = {
  playersLeft: PropTypes.array.isRequired,
  playersStartAmount: PropTypes.number.isRequired,
  myPosition: PropTypes.number.isRequired
};

export default PlayersList;
