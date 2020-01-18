import "./Lobby.scss";
import React from "react";
import { useHistory } from "react-router-dom";
import GoBackButtonLobby from "../GoBackButton/GoBackButton";

const Lobby = () => {
  const history = useHistory();

  const ws = new WebSocket("ws:localhost/api/lobby");

  ws.onmessage = function(event) {
    const messages = document.getElementById("messages");
    const data = event.data.replace(/[[\]']+/g, "");
    if (data === "start_game_1234" || data === "in_game_already") {
      history.push("/game");
      ws.close();
    } else {
      messages.innerHTML = data;
    }
  };
  return (
    <div className="Lobby">
      <GoBackButtonLobby />
      <div className="card">
        <h1 style={{ color: "white" }}>
          <p>Please wait.</p> Connected:{" "}
        </h1>
        <div style={{ color: "white" }} className="messages" id="messages">
          You're disconnected. Please log in
        </div>
      </div>
    </div>
  );
};

export default Lobby;
