import React from "react";
import Field from "./Field/Field";
import Board from "./Board.scss";

export default function SudokuBoard() {
  return generateBoard();
}

let generateBoard = () => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const rows = digits.map((row, idx) => {
    return (
      <tr key={idx}>
        {digits.map(col => (
          <td key={idx}>
            <Field value={row + col} row={row} col={col} />
          </td>
        ))}
      </tr>
    );
  });
  return (
    <div className="background">
      <table className="sudoku">
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
