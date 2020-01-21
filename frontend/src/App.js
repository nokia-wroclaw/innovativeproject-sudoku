import React from "react";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import Menu from "./components/Menu/Menu";
import Board from "./components/Board/Board";
import Settings from "./components/Settings/Settings";
import ParticlesComponent from "./components/ParticlesComponent/ParticlesComponent";
import Lobby from "./components/Lobby/Lobby";

const theme = createMuiTheme({
  overrides: {
    MuiInputLabel: {
      root: {
        color: "white",
        "&$focused": {
          color: "white",
          "&$error": {
            color: "#f44336"
          }
        }
      }
    },
    MuiInput: {
      root: {
        color: "white"
      },
      underline: {
        "&:after": {
          borderBottomColor: "white"
        },
        "&$focused:after": {
          borderBottomColor: "white"
        },
        "&:before": {
          borderBottomColor: "white"
        },
        "&:hover:not($disabled):not($focused):not($error):before": {
          borderBottomColor: "white"
        }
      }
    },
    MuiButton: {
      outlined: {
        borderColor: "white",
        color: "white",
        "&:hover": {
          backgroundColor: "white",
          color: "black"
        }
      }
    }
  }
});

function App() {
  return (
    <div className="App">
      <ParticlesComponent />
      <div className="foreground">
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/">
                <Redirect to="register" />
              </Route>
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/menu" component={Menu} />
              <Route path="/lobby" component={Lobby} />
              <Route path="/game" component={Board} />
              <Route path="/settings" component={Settings} />
              <Route path="*">
                <Redirect to="register" />
              </Route>
            </Switch>
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    </div>
  );
}

export default App;
