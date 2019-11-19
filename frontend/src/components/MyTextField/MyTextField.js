import React from "react";
import * as PropTypes from "prop-types";
import { useField } from "formik";
import TextField from "@material-ui/core/TextField";

const MyTextField = ({ label, type, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <TextField
      {...field}
      label={label}
      helperText={errorText}
      error={errorText !== ""}
      type={type}
      className="textField"
      margin="dense"
    />
  );
};

MyTextField.propTypes = {
  label: PropTypes.string
};

MyTextField.defaultProps = {
  label: ""
};

export default MyTextField;
