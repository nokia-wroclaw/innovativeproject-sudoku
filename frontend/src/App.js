import React from "react";
<<<<<<< HEAD
import "./App.css";
import Init from "./components/Init/Init";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Init text="Sudoku Battle Royale" />
      </header>
    </div>
  );
=======
import "./App.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Redirect} from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <div>
                    <Redirect exact from="/" to="/register" />
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <Route path="/game" />
                </div>
            </BrowserRouter>
        </div>
    );
>>>>>>> 5a86a30... login-register view before rebase
}

export default App;
