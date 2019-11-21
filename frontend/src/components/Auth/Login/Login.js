import "../Auth.scss";
import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import TextField from "../../TextField/TextField";

async function handleSubmit(params) {
  var FD = new FormData();
  FD.append("username", params.data.username);
  FD.append("password", params.data.password);

  fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    body: FD
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject({
          status: response.status,
          statusText: response.statusText
        });
      }
    })
    .catch(error => {
      if (error.status === 401) {
        window.alert("Wrong username or password.");
      }
    });
}

const validationSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required()
});

const form = {
  username: "",
  password: ""
};

const onSubmit = (data, setSubmitting) => {
  setSubmitting(true);
  handleSubmit({ data });
  setSubmitting(false);
};

const Login = () => {
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
                <TextField label="Password" name="password" type="password" />
              </div>
              <Button
                type="submit"
                variant="outlined"
                size="large"
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
