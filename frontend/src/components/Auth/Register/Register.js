import "../Auth.scss";
import Cookies from "js-cookie";
import React, { useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { Formik, Form } from "formik";
import * as yup from "yup";
import ky from "ky";
import TextField from "../../TextField/TextField";
import LoggedContext from "../../../contexts/LoggedContext";

const form = {
  username: "",
  password: "",
  rePassword: ""
};

const validationSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
  rePassword: yup
    .string()
    .required("confirm password is a required field")
    .oneOf([yup.ref("password")], "passwords don't match")
});

const Register = () => {
  const history = useHistory();
  const isLogged = useContext(LoggedContext);

  useEffect(() => {
    if (isLogged) {
      history.replace("/menu");
    }
  }, [isLogged]);

  async function handleRegister(params, setStatus) {
    const formData = new FormData();
    formData.append("username", params.data.username);
    formData.append("password", params.data.password);
    formData.append("re_password", params.data.rePassword);
    (async () => {
      try {
        await ky.post("/api/register", {
          body: formData
        });
        Cookies.set("username", params.data.username, { expires: 7 });
        history.push("/menu");
      } catch (e) {
        setStatus({ error: "registerError" });
      }
    })();
  }

  const onSubmit = (data, setSubmitting, setStatus) => {
    setSubmitting(true);
    handleRegister({ data }, setStatus);
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
