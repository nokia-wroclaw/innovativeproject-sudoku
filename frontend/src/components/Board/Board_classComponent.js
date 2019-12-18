import React from "react";
import _ from "lodash";
import LongPress from "react-long";
import { isMobile } from "react-device-detect";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Field from "./Field/Field";
import "./Board.scss";
import CircularMenu from "../CircularMenu/CircularMenu";
import FieldModel from "../../models/FieldModel";
import Timer from "../Timer/Timer";
import "../../Variables.scss";
import DragPanel from "../Draggable/DragPanel/DragPanel";
import GoBackButton from "../GoBackButton/GoBackButton";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.createRows(this.downloadNewBoard()),
      suggestions: null,
      addTime: 0
    };
  }

  checkBoardCorrect = () => {
    // Send this board to server
    // const boardForServer = this.parseBoard(this.state.rows);
    // Response from server
    const boardCorrect = true;
    if (boardCorrect) {
      this.addTime();
      this.reloadNewBoard();
    }
  };

  downloadNewBoard = () => {
    // Assign downloaded board to this variable
    const newBoard = [
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
    return newBoard;
  };

  addTime = time => {
    this.setState({ addTime: time });
  };

  reloadNewBoard = () => {
    this.setState({ rows: this.createRows(this.downloadNewBoard()) });
  };

  parseBoard = rows => {
    const userCompleteBoard = [];
    rows.forEach(row => {
      row.forEach(field => {
        userCompleteBoard.push(field.value);
      });
    });
    return userCompleteBoard;
  };

  createRows = fields => {
    const rows = [];
    let currentRow;
    for (let row = 0; row < 9; row++) {
      currentRow = [];
      rows.push(currentRow);
      for (let col = 0; col < 9; col++) {
        currentRow.push(
          new FieldModel(rows.length - 1, currentRow.length, fields[row][col])
        );
      }
    }
    return rows;
  };

  getPosition = element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  };

  hideSuggestions = () => {
    this.setState({ suggestions: null });
  };

  displaySuggestions = (row, column) => {
    this.setState({ suggestions: null });
    const coords = this.getPosition(
      document.getElementById(`${row}x${column}`)
    );
    this.setState({
      suggestions: { x: coords.x, y: coords.y, row, column }
    });
  };

  updateBoard = (row, column, item) => {
    const value = _.get(item, "value", item);
    this.setState(
      prev => ({
        rows: _.set(prev.rows, `['${row}'].['${column}'].value`, value)
      }),
      () => {
        this.checkBoardComplete();
      }
    );
  };

  checkBoardComplete = () => {
    let complete = true;
    this.state.rows.forEach(row => {
      row.forEach(field => {
        if (field.value === "") {
          complete = false;
        }
      });
    });
    if (complete) {
      this.checkBoardCorrect(this.state.rows);
    }
  };

  render() {
    const { rows, suggestions, addTime } = this.state;
    const boardRows = rows.map((row, idx) => {
      return (
        <tr key={idx}>
          {row.map(field => (
            <LongPress
              key={field.col}
              time={0.1}
              onLongPress={
                field.blocked
                  ? () => this.hideSuggestions()
                  : () => this.displaySuggestions(field.row, field.col)
              }
            >
              <td key={field.col} id={`${field.row}x${field.col}`}>
                <Field
                  key={field.value}
                  row={field.row}
                  col={field.col}
                  value={field.value}
                  onDrop={item => this.updateBoard(field.row, field.col, item)}
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
                          this.updateBoard(field.row, field.col, "");
                        }
                  }
                />
              </td>
            </LongPress>
          ))}
        </tr>
      );
    });

    return (
      <div className="gameView">
        <Timer start={60} gameEndCallback={() => {}} addTime={addTime} />
        <DndProvider backend={HTML5Backend}>
          <div className="gamePanel">
            <GoBackButton />
            <div className="sudoku sudoku-background">
              {suggestions && (
                <CircularMenu
                  itemsAmount={9}
                  suggestions={suggestions}
                  updateBoard={this.updateBoard}
                  hideMenu={this.hideSuggestions}
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
  }
}
