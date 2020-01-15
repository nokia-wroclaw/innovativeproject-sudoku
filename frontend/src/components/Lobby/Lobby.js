import "./Lobby.scss";
import React from "react";
import PropTypes from "prop-types";

const Lobby = () => {
  return (
    <div className="Lobby">
      <div className="card">
        <img src="logo.png" alt="logo_image" />
        <h1>Waiting for players...</h1>
      </div>
    </div>
  );
};

Lobby.propTypes = {};

export default Lobby;
