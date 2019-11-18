import React from "react";
import Field from "./Field/Field";
import "./Board.scss";

export default function SudokuBoard() {
  return generateBoard();
}

let generateBoard = () => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let key = 0;
  const rows = digits.map((row, idx) => {
    return (
      <tr key={key++}>
        {digits.map(col => (
          <td key={key++}>
            <Field value={row + col} row={row} col={col} />
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
};
