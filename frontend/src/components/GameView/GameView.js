import React, { useState, useEffect } from "react";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "./GameView.scss";
import Timer from "./Timer/Timer";
import "../../Variables.scss";
import Board from "../Board/Board";
import DragPanel from "../Draggable/DragPanel/DragPanel";
import GoBackButton from "../GoBackButton/GoBackButton";

export default function GameView() {
  let mockBoard = [
    [1, 2, 3, 4, 5, 1, 7, 8, 9],
    [1, 2, 1, 4, 5, 6, 1, 1, 9],
    [1, 2, 3, "#", "#", 6, 7, 8, 9],
    [1, 1, 3, 4, 1, 6, 1, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 1, 5, 6, 7, 8, 9],
    [1, 1, 3, 1, 5, 1, 7, 1, 9],
    [1, 2, 1, 4, 5, 6, 7, 1, 9],
    [1, 1, 3, 4, 5, 1, 7, 8, 1]
  ];

  const [serverBoard, setServerBoard] = useState(mockBoard);
  const [userBoard, setUserBoard] = useState(null);
  const [boardCounter, setBoardCounter] = useState(0);

  const getUserBoard = rows => {
    const userCompleteBoard = [];
    rows.forEach(row => {
      row.forEach(field => {
        userCompleteBoard.push(field.value);
      });
    });
    setUserBoard(userCompleteBoard);
  };

  useEffect(() => {
    if (userBoard != null) {
      //wysyłamy userBoard
      console.log("WYSYŁAM DO SERWERA SPRAWDZENIE");
      //otrzymane od serwera sprawdzenie
      const correct = true;
      if (correct) {
        console.log("ODBIERAM NOWĄ PLANSZĘ");
        const newBoard = [
          ["#", 2, 3, 4, 5, 1, 7, 8, 9],
          [1, 2, 1, 4, 5, 6, 1, 1, 9],
          [1, 2, 3, 5, 4, 6, 7, 8, 9],
          [1, 1, 3, 4, 1, 6, 1, 8, 9],
          [1, 2, 3, 4, 5, 6, 7, 8, 9],
          [1, 2, 3, 1, 5, 6, 7, 8, 9],
          [1, 1, 3, 1, 5, 1, 7, 1, 9],
          [1, 2, 1, 4, 5, 6, 7, 1, 9],
          [1, 1, 3, 4, 5, 1, 7, 8, 1]
        ];
        setServerBoard(newBoard);
        setBoardCounter(prev => {
          return prev + 1;
        });
      }
    }
  }, [userBoard]);

  useEffect(() => {}, [serverBoard]);

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
          <Board fields={serverBoard} getBoard={getUserBoard} />
          <DragPanel />
        </div>
      </DndProvider>
    </div>
  );
}
