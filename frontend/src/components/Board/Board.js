import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import LongPress from "react-long";
import Field from "./Field/Field";
import BoardModel from "../../models/BoardModel";
import "./Board.scss";
import CircularMenu from "../CircularMenu/CircularMenu";

export default class Board extends React.Component {
  state = {
    boardModel: new BoardModel(this.props.fields),
    suggestions: null
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
  };

  render() {
    const rows = this.state.boardModel.rows.map((row, idx) => {
      return (
        <tr key={idx}>
          {row.map(field => (
            <LongPress
              key={field.col}
              time={0.1}
              onLongPress={
                field.recived
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
                    this.state.suggestions &&
                    this.state.suggestions.row === idx &&
                    this.state.suggestions.column === field.col
                  }
                  recived={field.recived}
                />
              </td>
            </LongPress>
          ))}
        </tr>
      );
    });

    return (
      <div className="sudoku sudoku-background">
        {this.state.suggestions && (
          <CircularMenu
            itemsAmount={9}
            x={this.state.suggestions.x - 35}
            y={this.state.suggestions.y - 35}
            row={this.state.suggestions.row}
            column={this.state.suggestions.column}
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
  fields: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
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
