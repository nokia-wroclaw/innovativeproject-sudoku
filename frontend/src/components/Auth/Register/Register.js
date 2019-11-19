import "../Auth.scss";
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Formik, Form } from "formik";
import * as yup from "yup";
import MyTextField from "../../MyTextField/MyTextField";

const form = {
  email: "",
  password: "",
  rePassword: ""
};

const validationSchema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),
  rePassword: yup
    .string()
    .required("confirm password is a required field")
    .oneOf([yup.ref("password")], "Passwords don't match")
});

const onSubmit = (data, setSubmitting) => {
  setSubmitting(true);
  console.log(data);
  setSubmitting(false);
};

const Register = () => {
  return (
    <div className="card">
      <h1>Sudoku Battle Royale</h1>
      <Formik
        initialValues={form}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting }) => {
          onSubmit(data, setSubmitting);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="container">
            <div className="wrapper">
              <MyTextField label="Email" name="email" type="email" />
              <MyTextField label="Password" name="password" type="password" />
              <MyTextField
                label="Confirm password"
                name="rePassword"
                type="password"
              />
            </div>
            <Button
              type="submit"
              variant="outlined"
              size="large"
              className="mt-5 mb-3"
              disabled={isSubmitting}
            >
              Sign Up
            </Button>
          </Form>
        )}
      </Formik>

      <Link to="/login">Already have an account?</Link>
    </div>
  );
};

export default Register;
