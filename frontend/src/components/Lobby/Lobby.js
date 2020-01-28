import "./Lobby.scss";
import React, { useState, useEffect, useContext } from "react";
import { Button, Table, TableRow, TableCell } from "@material-ui/core";
import Cookies from "js-cookie";
import { useHistory } from "react-router";
import { Progress } from "react-sweet-progress";
import GoBackButtonLobby from "../GoBackButton/GoBackButton";
import CrazyAssWebSocket from "../../Utils";
import Loader from "../Loader/Loader";
import { buttonSound } from "../shared/Sounds";
import LoggedContext from "../../contexts/LoggedContext";

import "react-sweet-progress/lib/style.css";

const emptyPlayersList = ["-", "-", "-", "-", "-", "-", "-", "-"];

const Lobby = () => {
  const history = useHistory();
  const isLogged = useContext(LoggedContext);

  const [playersList, setPlayersList] = useState(emptyPlayersList);
  const [lobbyTimer, setLobbyTimer] = useState(15);
  const [message, setMessage] = useState("Waiting for players...");

  useEffect(() => {
    if (!isLogged) {
      history.replace("/login");
    }
  }, [isLogged, history]);

  // sprawdzić czy jest username w cookies i wylogować jak nie ma
  useEffect(() => {
    const ws = new CrazyAssWebSocket("/api/lobby");

    const makePlayersList = newPlayersList =>
      Object.assign(
        [...emptyPlayersList],
        newPlayersList
          .filter(username => username !== Cookies.get("username"))
          .slice(0, emptyPlayersList.length)
      );

    ws.onmessage = event => {
      const response = JSON.parse(event.data);

      switch (response.code) {
        case "start_game":
        case "in_game_already":
          history.push("/game");
          break;
        case "players":
          setPlayersList(makePlayersList(response.players));
          break;
        case "time":
          setMessage("Starting game...");
          setLobbyTimer(response.time);
          break;
        default:
          break;
      }
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, [history]);

  const renderColumn = odd => {
    return (
      <Table size="small">
        {playersList.map((player, index) => {
          return index % 2 === odd ? (
            <TableRow key={index + 2}>
              <TableCell style={{ width: "1px", padding: "0" }}>
                {index + 2}.
              </TableCell>
              <TableCell align="center" style={{ paddingRight: "30px" }}>
                {player}
              </TableCell>
            </TableRow>
          ) : null;
        })}
      </Table>
    );
  };

  const displayTimer = () => {
    return (
      <Progress
        percent={(parseInt(lobbyTimer, 10) / 15) * 100}
        theme={{
          active: {
            symbol: `${parseInt(lobbyTimer, 10)}s`,
            trailColor: "lightblue",
            color: "#68b3e1"
          },
          success: {
            symbol: "⏱️",
            trailColor: "lightblue",
            color: "#68b3e1"
          },
          default: {
            symbol: "0s",
            trailColor: "lightblue",
            color: "#68b3e1"
          }
        }}
      />
    );
  };

  const displayPlayersList = () => {
    return (
      <div className="players">
        <p>1. {Cookies.get("username")}</p>
        <div className="columns">
          {renderColumn(0)}
          {renderColumn(1)}
        </div>
      </div>
    );
  };

  return (
    <div className="Lobby">
      <GoBackButtonLobby />
      <div className="card">
        <img src="logo.png" alt="logo_image" />
        {displayTimer()}
        <h3>{message}</h3>
        {displayPlayersList()}
        <Loader />
        <Button
          disable="start"
          size="large"
          variant="outlined"
          onClick={() => {
            history.push("/menu");
            buttonSound.play();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Lobby;
