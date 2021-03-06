import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import ky from "ky";
import GridLoader from "react-spinners/GridLoader";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import Menu from "./components/Menu/Menu";
import Board from "./components/Board/Board";
import Settings from "./components/Settings/Settings";
import Lobby from "./components/Lobby/Lobby";
import Results from "./components/Results/Results";
import LoggedContext from "./contexts/LoggedContext";
import Stats from "./components/Stats/Stats";

const AppRouter = () => {
  const location = useLocation();
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      try {
        await ky.get("/api/get-access-token");
        setIsLogged(true);
      } catch (e) {
        setIsLogged(false);
      } finally {
        setLoading(false);
      }
    };
    getToken();
  }, [location]);

  return loading ? (
    <GridLoader loading={loading} color="#68b3e1" />
  ) : (
    <div>
      <LoggedContext.Provider value={isLogged}>
        <Switch>
          <Route exact path="/">
            <Redirect to="login" />
          </Route>
          <Route path="/settings" component={Settings} />
          <Route path="/menu" component={Menu} />
          <Route path="/game" component={Board} />
          <Route path="/lobby" component={Lobby} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/results" component={Results} />
          <Route path="/stats" component={Stats} />
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </LoggedContext.Provider>
    </div>
  );
};

export default AppRouter;
