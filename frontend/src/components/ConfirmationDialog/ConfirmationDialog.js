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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ConfirmationDialog = ({ open, title, success, fail, children }) => {
  const handleClose = succ => {
    // eslint-disable-next-line no-unused-expressions
    succ ? success() : fail();
  };

  return (
    <div className="ConfirmationDialog">
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
