import "./Menu.scss";
import { Link } from "react-router-dom";
import React from "react";

const Menu = () => {
  return (
    <div className="Menu">
      <div className="card">
        <h1>Sudoku Battle Royale</h1>
        <Link to="/game">
          <h3>Play</h3>
        </Link>
        <Link to="/game">
          <h3>Stats</h3>
        </Link>
        <Link to="/settings">
          <h3>Settings</h3>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
