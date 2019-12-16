import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "./GameView.scss";
import Timer from "./Timer/Timer";
import "../../Variables.scss";
import Board from "../Board/Board";
import DragPanel from "../Draggable/DragPanel/DragPanel";
import GoBackButton from "../GoBackButton/GoBackButton";

export default function GameView() {
  const board = [
    [1, 2, 3, 4, 5, 1, 7, 8, 9],
    [1, 2, 1, 4, 5, 6, 1, 1, 9],
    [1, 2, 3, "#", 5, 6, 7, 8, 9],
    [1, 1, 3, 4, 1, 6, 1, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 1, 5, 6, 7, 8, 9],
    [1, 1, 3, 1, 5, 1, 7, 1, 9],
    [1, 2, 1, 4, 5, 6, 7, 1, 9],
    [1, 1, 3, 4, 5, 1, 7, 8, 1]
  ];

  return (
    <div className="gameView">
      <Timer
        start={275}
        gameEndCallback={() => {
          console.log("GAME END");
        }}
      />
      <DndProvider backend={HTML5Backend}>
        <div className="gamePanel">
          <GoBackButton />
          <Board fields={board} />
          <DragPanel />
        </div>
      </DndProvider>
    </div>
  );
}
