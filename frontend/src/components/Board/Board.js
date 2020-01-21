import React, { useState, useEffect } from "react";
import _ from "lodash";
import Field from "./Field/Field";
import styles from "./Board.scss";
import CircularMenu from "../CircularMenu/CircularMenu";
import FieldModel from "../../models/FieldModel";
import "../../Variables.scss";
import GoBackButton from "../GoBackButton/GoBackButton";
import useTimer from "../../hooks/useTimer";
import PlayersList from "../PlayersList/PlayersList";
import BattleButtons from "../BattleButtons/BattleButtons";
import UIfx from "uifx";

const Board = () => {
  const [boardArray, setBoardArray] = useState(null);
  const [rows, setRows] = useState();
  const [suggestions, setSuggestions] = useState(null);
  const [displayButtons, setDisplayButtons] = useState(false);
  const [timeLeft, setTimeLeft, gameEnd] = useTimer(90);

  const { minutes, seconds } = timeLeft;

  let timerColor = styles.timer;

  const wrongBoardSound = new UIfx("/sounds/incorrect_board.mp3", {
    volume: 0.5 // number between 0.0 ~ 1.0
  });

  const correctBoardSound = new UIfx("/sounds/correct_board.mp3", {
    volume: 0.5 // number between 0.0 ~ 1.0
  });

  if (minutes === 0 && seconds < 20) {
    timerColor = "#cc0033";
  }

  if (gameEnd) {
    // Redirect to game end view
  }

  const downloadNewBoard = () => {
    setDisplayButtons(false);
    // fetch("https://sudokubr.me/api/sudoku")
    //   .then(res => res.json())
    //   .then(board => {
    //     setBoardArray(board.sudokuBoard);
    //   })
    //   .then(() => {
    setTimeLeft(40);
    //   });
    setBoardArray([
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0]
    ]);
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

  // Function disabled coz of eslint, prepared for board check in server
  const parseBoard = (sRow, sColumn, value) => {
    const userCompleteBoard = [];
    rows.forEach(row => {
      row.forEach(field => {
        if (row === sRow && field.col === sColumn) {
          userCompleteBoard.push(value);
        } else {
          userCompleteBoard.push(field.value);
        }
      });
    });
    return userCompleteBoard;
  };

  const checkBoardCorrect = (row, col, val) => {
    // Send this board to server
    // const boardForServer = parseBoard(row, col, val);
    parseBoard(row, col, val);
    // Response from server
    const boardCorrect = true;
    if (boardCorrect) {
      // downloadNewBoard();
      correctBoardSound.play();
      setDisplayButtons(true);
    } else {
      wrongBoardSound.play();
    }
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
  const checkBoardComplete = (sRow, sColumn, value) => {
    let complete = true;
    rows.forEach(row => {
      row.forEach(field => {
        if (field.value === "" && row !== sRow && field.col !== sColumn) {
          complete = false;
        }
      });
    });
    if (complete) {
      checkBoardCorrect(sRow, sColumn, value);
    }
  };

  const updateBoard = (row, column, item) => {
    const value = _.get(item, "value", item);
    setRows(prev => _.set(prev, `['${row}'].['${column}'].value`, value));
    checkBoardComplete(row, column, value);
  };

  let boardRows = null;
  if (rows) {
    boardRows = rows.map((row, idx) => {
      return (
        <tr key={idx}>
          {row.map(field => (
            <td key={field.col} id={`${field.row}x${field.col}`}>
              <Field
                key={field.value}
                row={field.row}
                col={field.col}
                value={field.value}
                isSelected={
                  suggestions &&
                  suggestions.row === idx &&
                  suggestions.column === field.col
                }
                blocked={field.blocked}
                onClick={
                  field.blocked ||
                  (suggestions &&
                    !(
                      suggestions.row === idx &&
                      suggestions.column === field.col
                    ))
                    ? () => hideSuggestions()
                    : () => displaySuggestions(field.row, field.col)
                }
              />
            </td>
          ))}
        </tr>
      );
    });
  }

  const renderMode = () => {
    if (displayButtons) {
      return <BattleButtons downloadNewBoard={downloadNewBoard} />;
    }
    return (
      <table>
        <tbody>{boardRows}</tbody>
      </table>
    );
  };

  return (
    <div className="gameView">
      <div className="Timer">
        <p style={{ color: timerColor }}>
          {minutes}:{seconds}
        </p>
      </div>
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
          {renderMode()}
        </div>
        <PlayersList playersLeft={5} myPosition={3} />
      </div>
    </div>
  );
};

export default Board;
