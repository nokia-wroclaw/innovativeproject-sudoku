import "./Menu.scss";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import React from "react";

const Menu = () => {
  return (
    <div className="Menu">
      <div className="card">
        <h1 style={{ color: "white" }}>Sudoku Battle Royale</h1>
        <Link to="/game">
          <Button size="large" variant="outlined">
            Play
          </Button>
        </Link>
        <Link to="/game">
          <Button size="large" variant="outlined">
            Stats
          </Button>
        </Link>
        <Link to="/settings">
          <Button size="large" variant="outlined">
            Settings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Menu;