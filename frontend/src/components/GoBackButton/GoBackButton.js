import "./GoBackButton.scss";
import React from "react";
import { IconButton } from "@material-ui/core";
import { buttonSound } from "../shared/Sounds";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import useNavigation from "../../hooks/useNavigation";

const GoBackButton = () => {
  const [open, setOpen, goBack] = useNavigation("/game");

  return (
    <div className="GoBackButton">
      <ConfirmationDialog
        title="Warning!"
        open={open}
        success={goBack}
        fail={() => setOpen(false)}
      >
        Are you sure you want to leave the game?
      </ConfirmationDialog>
      <IconButton
        onClick={() => {
          buttonSound.play();
          goBack();
        }}
      >
        <i className="fas fa-arrow-left" />
      </IconButton>
    </div>
  );
};

export default GoBackButton;
