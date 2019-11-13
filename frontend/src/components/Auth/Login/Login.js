import "../Auth.scss";
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import useForm from "../../../Hooks/useForm";

const onSubmit = event => {
  event.preventDefault();
};

const Login = () => {
  const [form, setForm] = useForm({
    email: {
      invalid: true,
      touched: false,
      value: ""
    },
    password: {
      invalid: true,
      touched: false,
      value: ""
    }
  });

  const [isFormValid, setFormValid] = useState(false);

  useEffect(() => {
    setFormValid(!form.email.invalid && !form.password.invalid);
  }, [form.email.invalid, form.password.invalid]);

  return (
    <div className="card">
      <h1>Sudoku Battle Royale</h1>
      <form className="container" onSubmit={onSubmit} id="form">
        <div>
          <TextField
            name="email"
            error={form.email.invalid && form.email.touched}
            label="Email"
            defaultValue={form.email.value}
            onChange={event => setForm("email", event.target.value)}
            className="textField"
            margin="normal"
          />
        </div>
        <div>
          <TextField
            name="password"
            error={form.password.invalid && form.password.touched}
            label="Password"
            type="password"
            defaultValue={form.password.value}
            onChange={event => setForm("password", event.target.value)}
            // onBlur={this.onInput}
            className="textField"
            margin="normal"
          />
        </div>
        <Button
          type="submit"
          variant="outlined"
          size="large"
          className="mt-3 mb-3"
          disabled={!isFormValid}
        >
          Sign In
        </Button>
      </form>
      <Link to="/register">New user? Register here!</Link>
    </div>
  );
};

export default Login;
