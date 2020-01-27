import React from "react";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter } from "react-router-dom";
import ParticlesComponent from "./components/ParticlesComponent/ParticlesComponent";

import AppRouter from "./AppRouter";

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
            <AppRouter />
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    </div>
  );
}

export default App;
