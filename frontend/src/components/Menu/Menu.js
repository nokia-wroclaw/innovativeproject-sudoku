import "./Menu.scss";
import React from "react";
import ky from "ky";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";
import { buttonSound } from "../shared/Sounds";

const Menu = () => {
  const history = useHistory();

  const logout = async () => {
    try {
      await ky.get("/api/logout");
      history.push("/login");
      window.location.reload();
    } catch (e) {
      console.log("logout error");
    }
  };

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
          size="large"
          variant="outlined"
          onClick={() => {
            history.push("/settings");
            buttonSound.play();
          }}
        >
          Settings
        </Button>
        <Button
          size="large"
          variant="outlined"
          onClick={() => {
            logout();
            buttonSound.play();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Menu;
