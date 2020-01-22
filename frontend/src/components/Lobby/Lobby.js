import "./Lobby.scss";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import GoBackButtonLobby from "../GoBackButton/GoBackButton";
import { CrazyAssWebSocket } from "../../Utils.js";

const Lobby = () => {
  const history = useHistory();

  const [messageHistory, setMessageHistory] = useState([[]]);

  useEffect(() => {
    const ws = new CrazyAssWebSocket("/api/lobby");

    ws.onmessage = event => {
      console.log(event.data);
      const response = event.data;
      setMessageHistory([...messageHistory, response]);
      if (response === "start_game_1234" || response === "in_game_already") {
        history.push("/game");
        ws.close();
      }
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="Lobby">
      <GoBackButtonLobby />
      <div className="card">
        <h1 style={{ color: "white" }}>
          <p>SudokuBR Lobby</p>
        </h1>
        <div style={{ color: "white" }} className="messages" id="messages">
          {messageHistory}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
