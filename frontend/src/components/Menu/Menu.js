import "./Menu.scss";
import React from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";

const Menu = () => {
  const history = useHistory();

  const redirect = path => {
    history.push(path);
  };

  return (
    <div className="Menu">
      <div className="card">
        <img src="logo.png" alt="logo_image" />
        <Button
          size="large"
          variant="outlined"
          onClick={() => redirect("/lobby")}
        >
          Play
        </Button>
        <Button
          size="large"
          variant="outlined"
          onClick={() => redirect("/game")}
        >
          Stats
        </Button>
        <Button
          size="large"
          variant="outlined"
          onClick={() => redirect("/settings")}
        >
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Menu;
