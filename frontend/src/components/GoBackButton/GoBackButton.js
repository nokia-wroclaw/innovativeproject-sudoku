import "./GoBackButton.scss";
import React from "react";
import { useHistory } from "react-router";
import { IconButton } from "@material-ui/core";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import useNavigation from "../../hooks/useNavigation";

const GoBackButton = () => {
  const [open, setOpen] = useNavigation("/game");
  const history = useHistory();

  const handleSuccess = () => {
    setOpen(false);
    history.goBack();
  };

  return (
    <div className="GoBackButton">
      <ConfirmationDialog
        title="Warning!"
        open={open}
        success={() => handleSuccess()}
        fail={() => setOpen(false)}
      >
        Are you sure you want to leave the game?
      </ConfirmationDialog>
      <IconButton onClick={() => setOpen(true)}>
        <i className="fas fa-arrow-left" />
      </IconButton>
    </div>
  );
};

export default GoBackButton;
