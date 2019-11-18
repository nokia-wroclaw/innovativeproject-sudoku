import React, { useState } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import Field from "./Field/Field";
import BoardModel from "../../models/BoardModel";
import "./Board.scss";

export default function Board({ fields }) {
  const [boardModel, setBoardModel] = useState(new BoardModel(fields));

  /*
  const handleDrop = useCallback(
    (row,column,item) => {
      const {value} = item;
      setBoardModel(_.set(boardModel,'rows['+row+'].['+column+'].value',value))
    },
    [boardModel.rows]
  )
*/
  const handleDrop = (row, column, item) => {
    const { value } = item;
    const x = _.set(boardModel, `rows['${row}'].['${column}'].value`, value);
    setBoardModel(x);
  };

  const rows = boardModel.rows.map((row, idx) => {
    return (
      <tr key={idx}>
        {row.map(field => (
          <td key={field.col}>
            <Field
              row={field.row}
              col={field.col}
              value={field.value}
              onDrop={item => handleDrop(field.row, field.col, item)}
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

Board.propTypes = {
  fields: PropTypes.string
};

Board.defaultProps = {
  fields: ""
};
