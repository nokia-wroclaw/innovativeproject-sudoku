import "./Menu.scss";
import React, { useEffect, useContext } from "react";
import ky from "ky";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";
import { buttonSound } from "../shared/Sounds";
import LoggedContext from "../../contexts/LoggedContext";

const Menu = () => {
  const history = useHistory();
  const isLogged = useContext(LoggedContext);

  useEffect(() => {
    if (!isLogged) {
      history.replace("/login");
    }
  }, [isLogged, history]);

  const logout = async () => {
    try {
      await ky.get("/api/logout");
      history.push("/login");
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
