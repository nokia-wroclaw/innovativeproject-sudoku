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
  const mockBoard = [
    ["#", 2, 3, 4, 5, "#", 7, 8, 9],
    [1, 2, "#", 4, 5, 6, "#", "#", 9],
    [1, 2, 3, "#", 5, 6, 7, 8, 9],
    [1, "#", 3, 4, "#", 6, "#", 8, 9],
    ["#", 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, "#", 5, 6, 7, 8, 9],
    [1, "#", 3, "#", 5, "#", 7, "#", 9],
    [1, 2, "#", 4, 5, 6, 7, "#", 9],
    [1, "#", 3, 4, 5, "#", 7, 8, "#"]
  ];

  const mockTime = { maxTime: 300, currentTime: 6 };

  return (
    <div className="gameView">
      <Timer {...mockTime} />
      <DndProvider backend={HTML5Backend}>
        <div className="gamePanel">
          <GoBackButton />
          <Board fields={mockBoard} />
          <DragPanel />
        </div>
      </DndProvider>
    </div>
  );
}
