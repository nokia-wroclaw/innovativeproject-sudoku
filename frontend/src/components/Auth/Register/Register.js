import "../Auth.scss";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Formik, Form } from "formik";
import * as yup from "yup";
import ky from "ky";
import TextField from "../../TextField/TextField";

async function handleRegister(params, setStatus) {
  const formData = new FormData();
  formData.append("username", params.data.username);
  formData.append("email", params.data.email);
  formData.append("password", params.data.password);
  formData.append("re_password", params.data.rePassword);
  (async () => {
    try {
      await ky.post("http://127.0.0.1:8000/register", {
        body: formData
      });
    } catch (e) {
      setStatus({ error: "registerError" });
    }
  })();
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
    .oneOf([yup.ref("password")], "passwords don't match")
});

const onSubmit = (data, setSubmitting, setStatus) => {
  setSubmitting(true);
  handleRegister({ data }, setStatus);
  setSubmitting(false);
};
const Register = () => {
  return (
    <div className="Auth">
      <div className="card">
        <h1 style={{ color: "white" }}>Sudoku Battle Royale</h1>
        <Formik
          initialValues={form}
          validationSchema={validationSchema}
          onSubmit={(data, { setSubmitting, setStatus }) => {
            onSubmit(data, setSubmitting, setStatus);
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
