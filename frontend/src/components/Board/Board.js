import React, { useState, useEffect } from "react";
import _ from "lodash";
import LongPress from "react-long";
import { isMobile } from "react-device-detect";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Line } from "rc-progress";
import Field from "./Field/Field";
import styles from "./Board.scss";
import CircularMenu from "../CircularMenu/CircularMenu";
import FieldModel from "../../models/FieldModel";
import "../../Variables.scss";
import DragPanel from "../Draggable/DragPanel/DragPanel";
import GoBackButton from "../GoBackButton/GoBackButton";
import useTimer from "../../hooks/useTimer";
import { useHistory } from "react-router-dom";

let ws;

const Board = () => {
  const history = useHistory();
  const [boardArray, setBoardArray] = useState(null);
  const [rows, setRows] = useState();
  const [suggestions, setSuggestions] = useState(null);
  const [timeLeft, setTimeLeft, gameEnd] = useTimer(90);
  const { progress, minutes, seconds } = timeLeft;
  let timerColor = styles.timer;

  if (minutes === 0 && seconds < 20) {
    timerColor = "#cc0033";
  }

  if (gameEnd) {
    console.log("GAME END");
  }

  const downloadNewBoard = () => {
    fetch("/api/sudoku")
      .then(res => res.json())
      .then(board => {
        setBoardArray(board.sudokuBoard);
      })
      .then(() => {
        //setTimeLeft(40);
      });
  };

  const createRows = board => {
    const newRows = [];
    let currentRow;
    for (let row = 0; row < 9; row++) {
      currentRow = [];
      newRows.push(currentRow);
      for (let col = 0; col < 9; col++) {
        currentRow.push(
          new FieldModel(newRows.length - 1, currentRow.length, board[row][col])
        );
      }
    }
    return newRows;
  };

  useEffect(() => {
    if (boardArray) {
      setRows(createRows(boardArray));
    } else {
      downloadNewBoard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardArray]);

  useEffect(() => {
    ws = new WebSocket("ws:localhost/api/game");

    ws.onmessage = function(event) {
      try {
        var data2json = JSON.parse(event.data);
        data2json = JSON.parse(data2json);
        console.log("Data from server: ", data2json);
        if (event.data === "no_game") {
          ws.close();
          history.push("/lobby");
        }
        if (data2json.timeLeft) {
          setTimeLeft(Math.round(data2json.timeLeft));
        }
        if (data2json.boardSolved) {
          downloadNewBoard();
        }
      } catch (e) {
        console.log(e, "error");
      }
    };
  }, []);

  const checkBoardCorrect = () => {
    var obj = new Object();
    obj.board = parseBoard(rows);
    var jsonString = JSON.stringify(obj);
    console.log(jsonString);
    ws.send(jsonString);
  };

  const getPosition = element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  };

  const hideSuggestions = () => {
    setSuggestions(null);
  };

  const displaySuggestions = (row, column) => {
    setSuggestions(null);
    const coords = getPosition(document.getElementById(`${row}x${column}`));
    setSuggestions({ x: coords.x, y: coords.y, row, column });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkBoardComplete = () => {
    let complete = true;
    rows.forEach(row => {
      row.forEach(field => {
        if (field.value === "") {
          complete = false;
        }
      });
    });
    if (complete) {
      checkBoardCorrect(rows);
    }
  };

  const parseBoard = board => {
    var userCompleteBoard = [];
    board.forEach(row => {
      var rowArr = [];
      row.forEach(field => {
        rowArr.push(field.value);
      });
      userCompleteBoard.push(rowArr);
    });
    return userCompleteBoard;
  };

  useEffect(() => {
    if (rows) {
      checkBoardComplete();
    }
  }, [rows, checkBoardComplete]);

  const updateBoard = (row, column, item) => {
    const value = _.get(item, "value", item);
    setRows(prev => _.set(prev, `['${row}'].['${column}'].value`, value));
  };

  let boardRows = null;
  if (rows) {
    boardRows = rows.map((row, idx) => {
      return (
        <tr key={idx}>
          {row.map(field => (
            <LongPress
              key={field.col}
              time={0.1}
              onLongPress={
                field.blocked
                  ? () => hideSuggestions()
                  : () => displaySuggestions(field.row, field.col)
              }
            >
              <td key={field.col} id={`${field.row}x${field.col}`}>
                <Field
                  key={field.value}
                  row={field.row}
                  col={field.col}
                  value={field.value}
                  onDrop={item => updateBoard(field.row, field.col, item)}
                  isSelected={
                    suggestions &&
                    suggestions.row === idx &&
                    suggestions.column === field.col
                  }
                  blocked={field.blocked}
                  onClick={
                    field.blocked || isMobile
                      ? null
                      : () => {
                          updateBoard(field.row, field.col, "");
                        }
                  }
                />
              </td>
            </LongPress>
          ))}
        </tr>
      );
    });
  }

  return (
    <div className="gameView">
      <div className="Timer">
        <p style={{ color: timerColor }}>
          {minutes}:{seconds}
        </p>
        <Line
          className="progressBar"
          percent={progress}
          strokeWidth="2"
          trailWidth="2"
          strokeColor={timerColor}
        />
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="gamePanel">
          <GoBackButton />
          <div className="sudoku sudoku-background">
            {suggestions && (
              <CircularMenu
                itemsAmount={9}
                suggestions={suggestions}
                updateBoard={updateBoard}
                hideMenu={hideSuggestions}
              />
            )}
            <table>
              <tbody>{boardRows}</tbody>
            </table>
          </div>
          <DragPanel />
        </div>
      </DndProvider>
    </div>
  );
};

export default Board;
