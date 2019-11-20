import React from "react";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import GameView from "./components/GameView/GameView";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <>
          <Switch>
            <Route exact path="/">
              <Redirect to="register" />
            </Route>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/game" component={GameView} />
            <Route path="*">
              <Redirect to="register" />
            </Route>
          </Switch>
        </>
      </BrowserRouter>
    </div>
  );
}

export default App;
