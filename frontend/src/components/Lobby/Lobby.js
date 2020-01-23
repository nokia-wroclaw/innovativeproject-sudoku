import "./Lobby.scss";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import GoBackButtonLobby from "../GoBackButton/GoBackButton";
import { CrazyAssWebSocket } from "../../Utils.js";
import { Button, Table, TableRow, TableCell } from "@material-ui/core";
import UIfx from "uifx";
import Loader from "../Loader/Loader";

const emptyPlayersList = ["-", "-", "-", "-", "-", "-", "-", "-"];

const Lobby = () => {
  const history = useHistory();

  const buttonSound = new UIfx("/sounds/button_click.mp3", {
    volume: 0.5
  });

  const [playersList, setPlayersList] = useState(emptyPlayersList);

  useEffect(() => {
    const ws = new CrazyAssWebSocket("/api/lobby");

    const makePlayersList = playersList =>
      Object.assign(
        [...emptyPlayersList],
        playersList.slice(0, emptyPlayersList.length)
      );

    ws.onmessage = event => {
      const response = JSON.parse(event.data);

      switch (response.type) {
        case "event":
          switch (response.code) {
            case "start_game":
            case "in_game_already":
              history.push("/game");
              ws.close();
              break;
            default:
              break;
          }
          break;
        case "data":
          setPlayersList([...makePlayersList(response.players)]);
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

  const displayPlayersList = () => {
    return (
      <div className="players">
        <p>1. MyUsername</p>
        <div className="columns">
          <Table size="small">
            {playersList.map((player, index) => {
              return (
                <TableRow key={index + 2}>
                  <TableCell style={{ width: "1px", padding: "0" }}>
                    {index + 2}.
                  </TableCell>
                  <TableCell align="center" style={{ paddingRight: "30px" }}>
                    {player}
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="Lobby">
      <GoBackButtonLobby />
      <div className="card">
        <img src="logo.png" alt="logo_image" />
        <h2>Waiting for players...</h2>
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
