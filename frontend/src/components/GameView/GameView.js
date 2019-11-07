import React from "react";
import "./GameView.scss";
import Board from "../Board/Board";
import DragPanel from "../DragPanel/DragPanel";

export default function GameView() {
  return (
    <div className="gamePanel">
      <Board />
      <DragPanel />
    </div>
  );
}
