import "./TextField.scss";
import React from "react";
import * as PropTypes from "prop-types";
import { useField } from "formik";
import MaterialTextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    "& label": {
      color: "white",
      "&.Mui-focused": {
        color: "white",
        "&.Mui-error": {
          color: "#f44336"
        }
      }
    },
    "& input": {
      color: "white"
    },
    "& .MuiInput-underline": {
      "&:after": {
        borderBottomColor: "white"
      },
      "&:before": {
        borderBottomColor: "white"
      },
      "&:hover": {
        "&:after": {
          borderBottomColor: "white"
        },
        "&:before": {
          borderBottomColor: "white"
        }
      },
      "&.Mui-error": {
        "&:after": {
          borderBottomColor: "#f44336"
        },
        "&:before": {
          borderBottomColor: "#f44336"
        }
      }
    }
  }
});

const TextField = ({ label, type, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  const classes = useStyles();

  return (
    <MaterialTextField
      {...field}
      label={label}
      helperText={errorText}
      error={errorText !== ""}
      type={type}
      classes={{ root: classes.root }}
      // InputProps={{
      //   style: {
      //     color: "white",
      //   }
      // }}
      className="textField"
      margin="dense"
      color="secondary"
    />
  );
};

TextField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string
};

TextField.defaultProps = {
  label: "",
  type: "text"
};

export default TextField;
