import React from "react";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import Menu from "./components/Menu/Menu";
import GameView from "./components/GameView/GameView";
import Settings from "./components/Settings/Settings";

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
            <Route path="/menu" component={Menu} />
            <Route path="/game" component={GameView} />
            <Route path="/settings" component={Settings} />
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
