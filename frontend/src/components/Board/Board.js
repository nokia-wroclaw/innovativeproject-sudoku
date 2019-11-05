import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import Field from "./Field/Field";
import BoardModel from "../../models/BoardModel";
import "./Board.scss";

export default class Board extends React.Component {
  state = {
    boardModel: new BoardModel(this.props.fields)
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

  render() {
    const rows = this.state.boardModel.rows.map((row, idx) => {
      return (
        <tr key={idx}>
          {row.map(field => (
            <td key={field.col}>
              <Field
                row={field.row}
                col={field.col}
                value={field.value}
                onDrop={item => this.handleDrop(field.row, field.col, item)}
              />
            </td>
          ))}
        </tr>
      );
    });

    return (
      <div className="background sudoku">
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

Board.propTypes = {
  fields: PropTypes.string
};

Board.defaultProps = {
  fields:
    "#################################################################################"
};
