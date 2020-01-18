import "./Lobby.scss";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, Table, TableRow, TableCell } from "@material-ui/core";
import Loader from "../Loader/Loader";

const Lobby = () => {
  const history = useHistory();
  // const [start, setstart] = useState(false);

  const init = ["-", "-", "-", "-", "-", "-", "-", "-"];

  const [players, setPlayers] = useState(init);

  useEffect(() => {
    setPlayers(["Player1", "Player2", "Player3", "-", "-", "-", "-", "-"]);
  }, []);

  const redirect = path => {
    history.push(path);
  };

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
      <div className="card">
        <img src="logo.png" alt="logo_image" />
        <h2>Waiting for players...</h2>
        {displayPlayers()}
        <Loader />
        <Button
          disable="start"
          size="large"
          variant="outlined"
          onClick={() => redirect("/menu")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Lobby;
