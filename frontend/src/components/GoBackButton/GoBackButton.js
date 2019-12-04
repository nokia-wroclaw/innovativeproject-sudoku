import "./GoBackButton.scss";
import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

const handler = (history, setOpen) => {
  if (history.location.pathname === "/game") {
    setOpen(true);
  } else {
    history.goBack();
  }
};

const handleSuccess = (history, setOpen) => {
  history.goBack();
  setOpen(false);
};

const GoBackButton = () => {
  const history = useHistory();
  const [open, setOpen] = useState(false);

  return (
    <div className="GoBackButton">
      <ConfirmationDialog
        title="Warning!"
        open={open}
        success={() => handleSuccess(history, setOpen)}
        fail={() => setOpen(false)}
      >
        Are you sure you want to leave the game?
      </ConfirmationDialog>
      <IconButton onClick={() => handler(history, setOpen)}>
        <i className="fas fa-arrow-left" />
      </IconButton>
    </div>
  );
};

export default GoBackButton;
