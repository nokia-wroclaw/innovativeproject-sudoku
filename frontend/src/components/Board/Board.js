import React, { useState } from "react";
import _ from "lodash";
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
import useUpdateEffect from "../../hooks/useUpdateEffect";
import useMountEffect from "../../hooks/useMountEffect";
import { correctBoardSound, wrongBoardSound } from "../shared/Sounds";

let ws;

const Board = () => {
  const history = useHistory();
  const [boardArray, setBoardArray] = useState(null);
  const [rows, setRows] = useState();
  const [suggestions, setSuggestions] = useState(null);
  const [displayButtons, setDisplayButtons] = useState(false);
  const [timeLeft, setTimeLeft, gameEnd] = useTimer(110);
  const [action, setAction] = useState();

  const { minutes, seconds } = timeLeft;

  let timerColor = styles.timer;

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

  useMountEffect(() => {
    downloadNewBoard();
  });

  useUpdateEffect(() => {
    const createRows = board => {
      const newRows = [];
      let currentRow;
      for (let row = 0; row < 9; row++) {
        currentRow = [];
        newRows.push(currentRow);
        for (let col = 0; col < 9; col++) {
          currentRow.push(
            new FieldModel(
              newRows.length - 1,
              currentRow.length,
              board[row][col]
            )
          );
        }
      }
      return newRows;
    };
    setRows(createRows(boardArray));
  }, [boardArray]);

  useMountEffect(() => {
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
                correctBoardSound.play();
                downloadNewBoard();
                setDisplayButtons(true);
                break;
              case "incorrect_board":
                wrongBoardSound.play();
                // TODO: handle incorrect board feedback
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
        if (response.timeLeft) {
          // TODO: update time on every response
          setTimeLeft(response.timeLeft);
        }
      } catch (e) {
        // TODO: handle errors
      }
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  useUpdateEffect(() => {
    // TODO: handling action - heal or fight
    // IDEA: send 'heal/fight message' to server
  }, [action]);

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
      ws.send(JSON.stringify(parseBoard(sRow, sColumn, value)));
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
        <BattleButtons setDisplay={setDisplayButtons} setAction={setAction} />
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
