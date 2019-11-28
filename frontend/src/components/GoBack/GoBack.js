import "./GoBack.scss";
import React from "react";
import { IconButton } from "@material-ui/core";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

const defaultBack = (
  <IconButton onClick={() => window.history.back()}>
    <i className="fas fa-arrow-left" />
  </IconButton>
);

const handleSuccess = () => {
  window.history.back();
};

const gameBack = (
  <div>
    <ConfirmationDialog title="Warning!" success={handleSuccess}>
      Are you sure you want to leave the game?
    </ConfirmationDialog>
  </div>
);

const GoBack = () => {
  return (
    <div className="GoBack">
      {window.location.pathname === "/game" ? gameBack : defaultBack}
    </div>
  );
};

export default GoBack;
