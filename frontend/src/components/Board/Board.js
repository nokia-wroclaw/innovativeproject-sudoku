import React, { useState, useEffect } from "react";
import _ from "lodash";
import UIfx from "uifx";
import { useHistory } from "react-router-dom";
import Field from "./Field/Field";
import styles from "./Board.scss";
import CircularMenu from "../CircularMenu/CircularMenu";
import FieldModel from "../../models/FieldModel";
import "../../Variables.scss";
import GoBackButton from "../GoBackButton/GoBackButton";
import useTimer from "../../hooks/useTimer";
import CrazyAssWebSocket from "../../Utils";
import PlayersList from "../PlayersList/PlayersList";
import BattleButtons from "../BattleButtons/BattleButtons";

let ws;

const Board = () => {
  const history = useHistory();
  const [boardArray, setBoardArray] = useState(null);
  const [rows, setRows] = useState();
  const [suggestions, setSuggestions] = useState(null);
  const [displayButtons, setDisplayButtons] = useState(false);
  const [timeLeft, setTimeLeft, gameEnd] = useTimer(110);

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
    fetch(`/api/sudoku`)
      .then(res => res.json())
      .then(board => {
        setBoardArray(board.sudokuBoard);
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
    ws = new CrazyAssWebSocket("/api/game");

    ws.onmessage = event => {
      try {
        const response = JSON.parse(event.data);

        switch (response.type) {
          case "event":
            switch (response.code) {
              case "no_game":
                ws.close();
                history.push("/lobby");
                break;
              case "game_lost":
                alert("You lost!");
                break;
              case "game_won":
                alert("You won!");
                break;
              case "next_level":
                // setTimeLeft(Math.round(response.time_left));
                setDisplayButtons(true);
                // downloadNewBoard();
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      } catch (e) {
        // console.log(event);
        // console.log(e);
      }
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, [history]);

  // const parseBoard = board => {
  //   const userCompleteBoard = [];
  //   board.forEach(row => {
  //     const rowArr = [];
  //     row.forEach(field => {
  //       rowArr.push(field.value);
  //     });
  //     userCompleteBoard.push(rowArr);
  //   });
  //   return userCompleteBoard;
  // };

  // Function disabled coz of eslint, prepared for board check in server
  const parseBoard = (sRow, sColumn, value) => {
    const userCompleteBoard = [];
    rows.forEach(row => {
      const rowArr = [];
      row.forEach(field => {
        if (field.row === sRow && field.col === sColumn) {
          rowArr.push(value);
        } else {
          rowArr.push(field.value);
        }
      });
      userCompleteBoard.push(rowArr);
    });
    return userCompleteBoard;
  };

  const checkBoardCorrect = (row, col, val) => {
    const boardForServer = parseBoard(row, col, val);

    console.log(boardForServer);

    ws.send(JSON.stringify(boardForServer));

    const boardCorrect = false;
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

  // useEffect(() => {
  //   const checkBoardComplete = board =>
  //     !board.filter(row => row.filter(field => field.value === ""));
  //   const checkBoardCorrect = () => {
  //     const boardStringified = JSON.stringify({ board: parseBoard(rows) });
  //     ws.send(boardStringified);
  //   };
  //   if (rows) {
  //     if (checkBoardComplete) {
  //       // checkBoardCorrect();
  //     }
  //   }
  // }, [rows]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const sendBoard = () => {
    ws.send(JSON.stringify({ board: parseBoard(rows) }));
  };

  const checkBoardComplete = (sRow, sColumn, value) => {
    let complete = true;
    rows.forEach(row => {
      row.forEach(field => {
        if (field.value === "" && field.row !== sRow && field.col !== sColumn) {
          complete = false;
        }
      });
    });
    if (complete) {
      console.log("COMLETED");
      checkBoardCorrect(sRow, sColumn, value);
    }
  };

  const updateBoard = (row, column, item) => {
    const value = _.get(item, "value", item);
    setRows(prev => _.set(prev, `['${row}'].['${column}'].value`, value));
    checkBoardComplete(row, column, item);
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
      return (
        <BattleButtons
          downloadNewBoard={downloadNewBoard}
          setTimeLeft={setTimeLeft}
        />
      );
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
