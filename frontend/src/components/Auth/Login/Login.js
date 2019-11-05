import "../Auth.scss";
import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

class Login extends Component {

    isFormValid = false;

    state = {
        email: {
            invalid: false,
            value: ''
        },
        password: {
            invalid: false,
            value: ''
        }
    };

    onInput = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: {
                invalid: value === "",
                value: value
            }
        }, () => {
            this.isFormValid = !this.state.email.invalid && !this.state.password.invalid
        });
    };

    onSubmit = event => {
        event.preventDefault();
        console.log(this.state)
    };

    render() {
        return (
            <div className="card">
                <h1>Sudoku Battle Royale</h1>
                <form className="container" onSubmit={this.onSubmit} id="form">
                    <div>
                        <TextField
                            name="email"
                            error={this.state.email.invalid}
                            label="Email"
                            defaultValue={this.state.email.value}
                            onChange={this.onInput}
                            onBlur={this.onInput}
                            className="textField"
                            margin="normal"
                        />
                    </div>
                    <div>
                        <TextField
                            name="password"
                            error={this.state.password.invalid}
                            label="Password"
                            type="password"
                            defaultValue={this.state.password.value}
                            onChange={this.onInput}
                            onBlur={this.onInput}
                            className="textField"
                            margin="normal"
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="outlined"
                        size="large"
                        className="mt-3 mb-3"
                        disabled={!this.isFormValid}
                    >
                        Sign In
                    </Button>
                </form>
                <Link to="/register">New user? Register here!</Link>
            </div>
        )
    }
}

export default Login;