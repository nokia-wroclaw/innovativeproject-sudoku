import React from "react";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import GameView from "./components/GameView/GameView"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          {/* <Redirect exact from="/" to="/register" /> */}
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/game" component={GameView} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
