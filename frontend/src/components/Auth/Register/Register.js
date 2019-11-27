import "../Auth.scss";
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Formik, Form } from "formik";
import * as yup from "yup";
import TextField from "../../TextField/TextField";
import Login from "../Login/Login";

async function handleRegister(params) {
  fetch("http://127.0.0.1:8000/register", {
    method: "POST",
    body: JSON.stringify(params.data)
  })
    .then(res => {
      if (res.ok) {
        window.alert(
          "You registered succesfully. Now login to your new account!"
        );
        window.location.replace("/login");
      } else {
        return Promise.reject({
          status: res.status,
          statusText: res.statusText
        });
      }
    })
    .catch(error => {
      switch (error.status) {
        case 409:
          window.alert("Username or email already taken.");
          break;
        case 417:
          window.alert(
            "You've manage to modify formik verification, you dirty hackerman!"
          );
      }
    });
}

const form = {
  username: "",
  email: "",
  password: "",
  rePassword: ""
};

const validationSchema = yup.object({
  username: yup.string().required(),
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
  handleRegister({ data });
  setSubmitting(false);
};
const Register = () => {
  return (
    <div className="Auth">
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
              <div className="textFieldWrapper">
                <TextField label="Username" name="username" type="username" />
                <TextField label="Email" name="email" type="email" />
                <TextField label="Password" name="password" type="password" />
                <TextField
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
    </div>
  );
};

export default Register;
