import "./Menu.scss";
import { Link } from "react-router-dom";
import React from "react";
import Button from "react-bootstrap/Button";

const Menu = () => {
  return (
    <div className="Menu">
      <div className="card">
        <h1 style={{ color: "white" }}>Sudoku Battle Royale</h1>
        <Link to="/game">
          <Button size="lg" variant="outline-light">
            Play
          </Button>
        </Link>
        <Link to="/game">
          <Button size="lg" variant="outline-light">
            Stats
          </Button>
        </Link>
        <Link to="/settings">
          <Button size="lg" variant="outline-light">
            Settings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
