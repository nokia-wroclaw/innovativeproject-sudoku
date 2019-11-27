import "./GoBack.scss";
import { Link } from "react-router-dom";
import React from "react";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

const defaultBack = (
  <Link to="/menu" replace>
    <i className="fas fa-arrow-left" />
  </Link>
);

const handleSuccess = () => {};

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
