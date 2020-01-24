import "./Menu.scss";
import React from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";
import { buttonSound } from "../shared/Sounds";

const Menu = () => {
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
