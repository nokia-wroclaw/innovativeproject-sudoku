import "./Settings.scss";
import React from "react";
import GoBackButton from "../GoBackButton/GoBackButton";

const Settings = () => {
  return (
    <div className="Settings">
      <GoBackButton />
      <div className="card">
        <h1>Settings</h1>
      </div>
    </div>
  );
};

export default Settings;
