import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";
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
  const [timeLeft, setTimeLeft] = useTimer(0);
  const [action, setAction] = useState();
  const [borderRed, setBorderRed] = useState();
  const [players, setPlayers] = useState([]);
  const [playersStartAmount, setPlayersStartAmount] = useState(0);
  const [username, setUsername] = useState();
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    ws = new CrazyAssWebSocket("/api/game");

    ws.onmessage = event => {
      const response = JSON.parse(event.data);

      switch (response.code) {
        case "start":
          setUsername(response.username);
          setPlayers(response.players);
          setPlayersStartAmount(response.players.length);
          setBoardArray(response.board);
          setLoading(false);
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

    return () => {
      ws.close();
    };
  }, []);

  useUpdateEffect(() => {
    setRows(
      boardArray.map((row, i) =>
        row.map((value, j) => new FieldModel(i, j, value))
      )
    );
  }, [boardArray]);

  useUpdateEffect(() => {
    if (action === Action.HEAL) {
      ws.send(JSON.stringify({ code: "heal" }));
    } else if (action === Action.FIGHT) {
      ws.send(JSON.stringify({ code: "fight" }));
    }
    setAction(null);
  }, [action]);

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

  useEffect(() => {
    if (rows) {
      setBorderRed(false);
      if (!rows.some(row => row.some(field => field.value === ""))) {
        ws.send(
          JSON.stringify({
            code: "check_board",
            board: rows.map(row => row.map(field => field.value))
          })
        );
      }
    }
  }, [rows]);

  const updateBoard = (row, column, value) => {
    rows[row][column].value = value;
    setRows([...rows]);
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

  return loading ? (
    <GridLoader loading={loading} color={styles.timer} />
  ) : (
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
