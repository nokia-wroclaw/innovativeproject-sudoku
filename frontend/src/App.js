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
import { Board } from "./components/Board/Board";
import Settings from "./components/Settings/Settings";
// import ParticlesComponent from "./components/ParticlesComponent/ParticlesComponent";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        await ky.get("/api/get-access-token");
        setIsLoggedIn(true);
      } catch (e) {
        setIsLoggedIn(false);
      }
    };

    getToken();
  }, [setIsLoggedIn]);

  return (
    <div className="App">
      {/* <ParticlesComponent /> */}
      <div className="foreground">
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/">
                <Redirect to="login" />
              </Route>
              <AuthenticatedRoute
                path="/settings"
                component={Settings}
                appProps={{ isLoggedIn }}
              />
              <AuthenticatedRoute
                path="/menu"
                component={Menu}
                appProps={{ isLoggedIn }}
              />
              <AuthenticatedRoute
                path="/game"
                component={Board}
                appProps={{ isLoggedIn }}
              />
              <AuthenticatedRoute
                path="/lobby"
                component={Lobby}
                appProps={{ isLoggedIn }}
              />
              <UnauthenticatedRoute
                path="/register"
                component={Register}
                appProps={{ isLoggedIn }}
              />
              <UnauthenticatedRoute
                path="/login"
                component={Login}
                appProps={{ isLoggedIn }}
              />
              <Route path="*">
                <Redirect to="login" />
              </Route>
            </Switch>
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    </div>
  );
}

export default App;
