import "./Menu.scss";
import React from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";

const Menu = () => {
  const history = useHistory();

  return (
    <div className="Menu">
      <div className="card">
        <img src="logo.png" alt="logo_image" />
        <Button
          size="large"
          variant="outlined"
          onClick={() => history.push("/lobby")}
        >
          Play
        </Button>
        <Button
          size="large"
          variant="outlined"
          onClick={() => history.push("/game")}
        >
          Stats
        </Button>
        <Button
          size="large"
          variant="outlined"
          onClick={() => history.push("/settings")}
        >
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Menu;
