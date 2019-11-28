import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import PropTypes from "prop-types";
import React, { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ConfirmationDialog = ({ title, success, fail, children }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = succ => {
    setOpen(false);
    // eslint-disable-next-line no-unused-expressions
    succ ? success() : fail();
  };

  return (
    <div className="ConfirmationDialog">
      <Button color="primary" onClick={handleClickOpen} size="large">
        Exit
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose(true);
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
  title: PropTypes.string,
  children: PropTypes.string,
  success: PropTypes.func,
  fail: PropTypes.func
};

ConfirmationDialog.defaultProps = {
  title: "Confirmation",
  children: "Are you sure?",
  success: () => {},
  fail: () => {}
};

export default ConfirmationDialog;
