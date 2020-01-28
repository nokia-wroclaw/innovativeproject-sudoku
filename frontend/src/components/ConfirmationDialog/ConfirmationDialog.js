import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import PropTypes from "prop-types";
import { buttonSound } from "../shared/Sounds";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ConfirmationDialog = ({ open, title, success, fail, children }) => {
  return (
    <div className="ConfirmationDialog">
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              buttonSound.play();
              fail();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              buttonSound.play();
              success();
            }}
            color="secondary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.string,
  success: PropTypes.func,
  fail: PropTypes.func
};

ConfirmationDialog.defaultProps = {
  open: true,
  title: "Confirmation",
  children: "Are you sure?",
  success: () => {},
  fail: () => {}
};

export default ConfirmationDialog;
