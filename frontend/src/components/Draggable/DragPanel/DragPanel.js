import React from "react";
import "./DragPanel.scss";
import DraggableField from "../DraggableField/DraggableField";

const generatePanel = () => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const rows = digits.map((val, idx) => {
    return (
      <tr key={idx}>
        <td key={idx}>
          <DraggableField value={val} />
        </td>
      </tr>
    );
  });
  return (
    <table className="dragPanel">
      <tbody>{rows}</tbody>
    </table>
  );
};

export default function DragPanel() {
  return <div className="background">{generatePanel()}</div>;
}
