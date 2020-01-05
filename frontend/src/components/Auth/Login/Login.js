import "../Auth.scss";
import React from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import ky from "ky";
import TextField from "../../TextField/TextField";

async function handleSubmit(params, setStatus) {
  const formData = new FormData();
  formData.append("username", params.data.username);
  formData.append("password", params.data.password);
  (async () => {
    try {
      await ky.post("http://127.0.0.1:8000/login", {
        body: formData
      });
    } catch (e) {
      setStatus({ error: "loginError" });
    }
  })();
}

const validationSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required()
});

const form = {
  username: "",
  password: ""
};

const Login = () => {
  const history = useHistory();

  const onSubmit = (data, setSubmitting, setStatus) => {
    setSubmitting(true);
    handleSubmit({ data }, setStatus);
    history.push("/menu");
    setSubmitting(false);
  };

  return (
    <div className="Auth">
      <div className="card">
        <img src="logo.png" alt="logo_image" />
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
                <TextField label="Password" name="password" type="password" />
              </div>
              <Button
                type="submit"
                className="mt-5 mb-3"
                size="large"
                variant="outlined"
                color="default"
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
