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
    console.log(data);

    // if (data.includes("set_cookie:")){
    //    const username = event.data.replace("set_cookie: ", "");
    //     console.log(username, "dadadadada");
    // }

    if (data === "start_game_1234") {
      history.push("/game");
      ws.close();
    } else if (data === "in_game_already") {
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
          aaaa
        </div>
      </div>
    </div>
  );
};

export default Lobby;
