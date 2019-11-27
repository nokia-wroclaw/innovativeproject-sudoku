import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "./GameView.scss";
import Timer from "./Timer/Timer";
import "../../Variables.scss";
import Board from "../Board/Board";
import DragPanel from "../Draggable/DragPanel/DragPanel";

export default function GameView() {
  const mockBoard = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
  ];

  const mockTime = { max_time: 300, current_time: 6 };

  return (
    <div className="gameView">
      <Timer currentTime={mockTime.current_time} maxTime={mockTime.max_time} />
      <DndProvider backend={HTML5Backend}>
        <div className="gamePanel">
          <Board fields={mockBoard} />
          <DragPanel />
        </div>
      </DndProvider>
    </div>
  );
}
