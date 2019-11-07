import React from "react";
import "./GameView.scss";
import Board from "../Board/Board";
import DragPanel from "../Dragable/DragPanel/DragPanel";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

export default function GameView() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="gamePanel">
        <Board />
        <DragPanel />
      </div>
    </DndProvider>
  );
}
