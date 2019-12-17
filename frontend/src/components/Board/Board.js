import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import LongPress from "react-long";
import { isMobile } from "react-device-detect";
import Field from "./Field/Field";
import "./Board.scss";
import CircularMenu from "../CircularMenu/CircularMenu";
import FieldModel from "../../models/FieldModel";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.rows = this.createRows();
    this.state = {
      rows: this.rows,
      suggestions: null,
      boardComplete: false
    };
  }

  createRows = () => {
    let rows = [];
    let currentRow;
    for (let row = 0; row < 9; row++) {
      currentRow = [];
      rows.push(currentRow);
      for (let col = 0; col < 9; col++) {
        currentRow.push(
          new FieldModel(
            rows.length - 1,
            currentRow.length,
            this.props.fields[row][col]
          )
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

  handleDrop = (row, column, item) => {
    const { value } = item;
    this.setState(
      prev => ({
        rows: _.set(prev.rows, `['${row}'].['${column}'].value`, value)
      }),
      () => {
        this.checkBoardComplete();
      }
    );
  };

  updateBoard = (row, column, value) => {
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
      this.props.getBoard(this.state.rows);
    }
  };

  render() {
    const { rows, suggestions } = this.state;
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
          <tbody>{boardRows}</tbody>
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
