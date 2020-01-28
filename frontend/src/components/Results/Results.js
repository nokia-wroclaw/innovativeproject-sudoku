import "./Results.scss";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import LoggedContext from "../../contexts/LoggedContext";

const Result = () => {
  const history = useHistory();
  const isLogged = useContext(LoggedContext);
  const location = useLocation();
  const [place, setPlace] = useState();
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!isLogged) {
      history.replace("/login");
    }
    if (!location.state) {
      history.replace("/menu");
    } else {
      setPlace(location.state.place);
    }
  }, [isLogged, history, location.state]);

  const renderConfetti = () => {
    return place === 1 && <Confetti width={width} height={height} />;
  };

  return (
    <div className="Results">
      {renderConfetti()}
      <div className="card">
        <img src="logo.png" alt="logo_image" />
        <h2>{place === 1 ? "YOU WIN!" : "YOU LOST"}</h2>
        <h1>#{place}</h1>
        <Button
          className="mt-4"
          size="large"
          variant="outlined"
          color="default"
          onClick={() => history.push("/lobby")}
        >
          Play again
        </Button>
        <Button
          className="mt-4"
          size="large"
          variant="outlined"
          color="default"
          onClick={() => history.push("/menu")}
        >
          Menu
        </Button>
      </div>
    </div>
  );
};

export default Result;
