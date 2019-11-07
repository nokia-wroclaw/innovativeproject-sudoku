import React from "react";
import "./DragPanel.scss";
import DragableField from "../DragableField/DragableField";

const renderField = value => {
  return <DragableField value={value} key={value} />;
};

const generatePanel = () => {
  const fields = [];
  for (let i = 1; i < 10; i++) {
    fields.push(renderField(i));
  }
  return fields;
};

export default function DragPanel() {
  return (
    <div className="card">
      <div className="dragPanel"> {generatePanel()} </div>
    </div>
  );
}
