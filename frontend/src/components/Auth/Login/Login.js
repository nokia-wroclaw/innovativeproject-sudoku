import "../Auth.scss";
import React from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import TextField from "../../TextField/TextField";

const form = {
  email: "",
  password: ""
};

const validationSchema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required()
});

const onSubmit = (data, setSubmitting) => {
  setSubmitting(true);
  console.log(data);
  setSubmitting(false);
};

const Login = () => {
  return (
    <div className="Auth">
      <div className="card">
        <h1 style={{ color: "white" }}>Sudoku Battle Royale</h1>
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
                <TextField label="Email" name="email" type="email" />
                <TextField label="Password" name="password" type="password" />
              </div>
              <Button
                type="submit"
                variant="outline-light"
                size="lg"
                className="mt-5 mb-3"
                disabled={isSubmitting}
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>
        <Link to="/register">New user? Register here!</Link>
      </div>
    </div>
  );
};

export default Login;
