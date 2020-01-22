import "./Lobby.scss";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import GoBackButtonLobby from "../GoBackButton/GoBackButton";
import { CrazyAssWebSocket } from "../../Utils.js";
import { Button, Table, TableRow, TableCell } from "@material-ui/core";

const Lobby = () => {
  const history = useHistory();
  const init = ["-", "-", "-", "-", "-", "-", "-", "-"];

  const [players, setPlayers] = useState(init);

  useEffect(() => {
    const ws = new CrazyAssWebSocket("/api/lobby");

    const makePlayersList = playersList =>
      Object.assign(init, playersList.slice(0, init.length));

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
          setPlayers(makePlayersList(response.players));
          break;
        default:
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [history, setPlayers, init]);

  const displayPlayers = () => {
    return (
      <div className="players">
        <p>1. MyUsername</p>
        <div className="columns">
          <Table size="small">
            {players.map((player, index) => {
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
        {displayPlayers()}
        <Button
          disable="start"
          size="large"
          variant="outlined"
          onClick={() => {
            history.push("/menu");
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Lobby;
