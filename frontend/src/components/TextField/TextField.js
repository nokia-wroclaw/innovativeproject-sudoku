import "./TextField.scss";
import React from "react";
import * as PropTypes from "prop-types";
import { useField } from "formik";
import MaterialTextField from "@material-ui/core/TextField";

const TextField = ({ label, type, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <MaterialTextField
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

TextField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string
};

TextField.defaultProps = {
  label: "",
  type: "text"
};

export default TextField;
