import React, { useState, useEffect, useContext } from "react";
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
import {
  correctBoardSound,
  wrongBoardSound,
  attackedSound
} from "../shared/Sounds";
import Action from "../shared/Action";
import LoggedContext from "../../contexts/LoggedContext";

let ws;

const Board = () => {
  const history = useHistory();
  const isLogged = useContext(LoggedContext);
  const [boardArray, setBoardArray] = useState(null);
  const [rows, setRows] = useState();
  const [suggestions, setSuggestions] = useState(null);
  const [displayButtons, setDisplayButtons] = useState(false);
  const [timeLeft, setTimeLeft] = useTimer(1297);
  const [action, setAction] = useState();
  const [borderRed, setBorderRed] = useState();
  const [players, setPlayers] = useState([]);
  const [playersStartAmount, setPlayersStartAmount] = useState(0);
  const [username, setUsername] = useState();

  const { minutes, seconds } = timeLeft;

  let timerColor = styles.timer;

  if (minutes === 0 && seconds < 20) {
    timerColor = styles.redTimer;
  }

  useEffect(() => {
    if (!isLogged) {
      history.replace("/login");
    }
  }, [isLogged, history]);

  useMountEffect(() => {
    ws = new CrazyAssWebSocket("/api/game");

    ws.onmessage = event => {
      const response = JSON.parse(event.data);

      switch (response.code) {
        case "start":
          setUsername(response.username);
          setPlayers(response.players);
          setPlayersStartAmount(response.players.length);
          setBoardArray(response.board);
          break;
        case "no_game":
          ws.close();
          history.push("/lobby");
          break;
        case "game_lost":
          history.push("/results", { place: response.position });
          break;
        case "game_won":
          history.push("/results", { place: 1 });
          break;
        case "next_level":
          correctBoardSound.play();
          setBoardArray(response.board);
          setDisplayButtons(true);
          break;
        case "incorrect_board":
          wrongBoardSound.play();
          setBorderRed(true);
          break;
        case "attacked":
          attackedSound.play();
          break;
        case "players":
          setPlayers(response.players);
          break;
        default:
          break;
      }

      if (response.time_left) {
        setTimeLeft(response.time_left);
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

  useUpdateEffect(() => {
    if (action === Action.HEAL) {
      ws.send(JSON.stringify({ code: "heal" }));
    } else if (action === Action.FIGHT) {
      ws.send(JSON.stringify({ code: "fight" }));
    }
    setAction(null);
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
    setBorderRed(false);
    let complete = true;
    rows.forEach(row => {
      row.forEach(field => {
        if (field.value === "" && field.row !== sRow && field.col !== sColumn) {
          complete = false;
        }
      });
    });
    if (complete) {
      ws.send(
        JSON.stringify({
          code: "check_board",
          board: parseBoard(sRow, sColumn, value)
        })
      );
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
      <div className="gamePanel">
        <GoBackButton />
        <div>
          <div className="Timer">
            <p style={{ color: timerColor }}>
              {minutes}:{seconds}
            </p>
          </div>
          <div
            className={`sudoku sudoku-background ${
              borderRed ? "borderRed" : null
            }`}
          >
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
        </div>
        <PlayersList
          myPosition={players.map(p => p.username).indexOf(username) || 0}
          playersStartAmount={playersStartAmount}
          playersLeft={players}
        />
      </div>
    </div>
  );
};

export default Board;
