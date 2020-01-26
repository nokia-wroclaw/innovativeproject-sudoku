import "./Settings.scss";
import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router";
import GoBackButton from "../GoBackButton/GoBackButton";
import LoggedContext from "../../contexts/LoggedContext";

const Settings = () => {
  const history = useHistory();
  const isLogged = useContext(LoggedContext);

  useEffect(() => {
    if (!isLogged) {
      history.replace("/login");
    }
  }, [isLogged]);

  return (
    <div className="Settings">
      <GoBackButton />
      <div className="card">
        <h1 style={{ color: "white" }}>Settings</h1>
      </div>
    </div>
  );
};

export default Settings;
