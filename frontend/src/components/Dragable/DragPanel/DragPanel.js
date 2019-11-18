import React from "react";
import "./DragPanel.scss";
import DragableField from "../DragableField/DragableField";
import "../../Board/Board.scss";

const renderField = value => {
  return <DragableField value={value} key={value} />;
};

const generatePanel = () => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const rows = digits.map((val, idx) => {
    return (
      <tr key={idx}>
        <td key={idx}>
          <DragableField value={val} />
        </td>
      </tr>
    );
  });
  return <div className="dragPanel">{rows} </div>;
};

export default function DragPanel() {
  return (
    <div className="card">
      <div className="table"> {generatePanel()} </div>
    </div>
  );
}
