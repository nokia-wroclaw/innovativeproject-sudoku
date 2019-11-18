import React from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "./GameView.scss";
import Board from "../Board/Board";
import DragPanel from "../Dragable/DragPanel/DragPanel";

export default function GameView() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="gamePanel">
        <Board fields="12345#111111111111111111111111111111111111111111111111111111111111111111111111111" />
        <DragPanel />
      </div>
    </DndProvider>
  );
}
