import React, { useState, useEffect } from "react";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import ky from "ky";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import Menu from "./components/Menu/Menu";
import Board from "./components/Board/Board";
import Settings from "./components/Settings/Settings";
import ParticlesComponent from "./components/ParticlesComponent/ParticlesComponent";
import Lobby from "./components/Lobby/Lobby";
import AuthenticatedRoute from "./routes/AuthenticatedRoute";
import UnauthenticatedRoute from "./routes/UnauthenticatedRoute";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function Auth() {
    try {
      await ky.get("/api/get-access-token");
      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);
    }
  }

  async function onLoad() {
    try {
      await Auth();
      setIsAuthenticated(true);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    onLoad();
  }, []);

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
              <AuthenticatedRoute
                path="/settings"
                component={Settings}
                appProps={{ isAuthenticated }}
              />
              <AuthenticatedRoute
                path="/menu"
                component={Menu}
                appProps={{ isAuthenticated }}
              />
              <AuthenticatedRoute
                path="/game"
                component={Board}
                appProps={{ isAuthenticated }}
              />
              <AuthenticatedRoute
                path="/lobby"
                component={Lobby}
                appProps={{ isAuthenticated }}
              />
              <UnauthenticatedRoute
                path="/register"
                component={Register}
                appProps={{ isAuthenticated }}
              />
              <UnauthenticatedRoute
                path="/login"
                component={Login}
                appProps={{ isAuthenticated }}
              />
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
