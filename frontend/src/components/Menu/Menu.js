import "./Menu.scss";
import React from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";
import UIfx from "uifx";

const Menu = () => {
  const buttonSound = new UIfx("/sounds/button_click.mp3", {
    volume: 0.5 // number between 0.0 ~ 1.0
  });

  const history = useHistory();

  return (
    <div className="Menu">
      <div className="card">
        <img src="logo.png" alt="logo_image" />
        <Button
          size="large"
          variant="outlined"
          onClick={() => {
            history.push("/lobby");
            buttonSound.play();
          }}
        >
          Play
        </Button>
        <Button
          disabled
          size="large"
          variant="outlined"
          onClick={() => {
            history.push("/game");
            buttonSound.play();
          }}
        >
          Stats
        </Button>
        <Button
          disabled
          size="large"
          variant="outlined"
          onClick={() => {
            history.push("/settings");
            buttonSound.play();
          }}
        >
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Menu;
