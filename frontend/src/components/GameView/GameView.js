import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "./GameView.scss";
import Board from "../Board/Board";
import DragPanel from "../Draggable/DragPanel/DragPanel";
import GoBack from "../GoBack/GoBack";

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="gamePanel">
        <GoBack />
        <Board fields={mockBoard} />
        <DragPanel />
      </div>
    </DndProvider>
  );
}
