import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import LongPress from "react-long";
import { isMobile } from "react-device-detect";
import Field from "./Field/Field";
import BoardModel from "../../models/BoardModel";
import "./Board.scss";
import CircularMenu from "../CircularMenu/CircularMenu";

export default class Board extends React.Component {
  state = {
    boardModel: new BoardModel(this.props.fields),
    suggestions: null,
    boardComplete: false
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

  handleDrop = (row, column, item) => {
    const { value } = item;
    this.setState(prev => ({
      boardModel: _.set(
        prev.boardModel,
        `rows['${row}'].['${column}'].value`,
        value
      )
    }));
    this.checkBoardComplete();
  };

  blockField = () => {};

  updateBoard = (row, column, value) => {
    this.setState(prev => ({
      boardModel: _.set(
        prev.boardModel,
        `rows['${row}'].['${column}'].value`,
        value
      )
    }));
    this.hideSuggestions();
    this.checkBoardComplete();
  };

  checkBoardComplete = () => {
    let complete = true;
    this.state.boardModel.rows.forEach(row => {
      row.forEach(field => {
        if (field.value === "") {
          complete = false;
        }
      });
    });
    this.setState({ boardComplete: complete });
  };

  render() {
    const { boardModel, suggestions } = this.state;
    const rows = boardModel.rows.map((row, idx) => {
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
                  row={field.row}
                  col={field.col}
                  value={field.value}
                  onDrop={item => this.handleDrop(field.row, field.col, item)}
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
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

Board.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  )
};

Board.defaultProps = {
  fields: [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
  ]
};
