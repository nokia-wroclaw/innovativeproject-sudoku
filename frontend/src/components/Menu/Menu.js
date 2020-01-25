import "./Menu.scss";
import React from "react";
import Cookies from "js-cookie";
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
        <Button
          size="large"
          variant="outlined"
          onClick={() => {
            Cookies.remove("access_token", { path: "/" });
            Cookies.remove("refresh_token", { path: "/" });
            // Cookies.set('test', { path: '/' })
            // console.log("set")
            // Cookies.remove('test', { path: '/' })
            // console.log("removed")
            console.log(Cookies.get("access_token", { path: "/" }));
            history.push("/login");
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
