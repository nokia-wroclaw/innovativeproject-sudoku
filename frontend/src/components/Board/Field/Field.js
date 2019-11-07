import React from "react";
import ReactDOM from "react-dom";
import "./Field.scss";

export default function Field({ x, y, value }) {
  return (
    <div className="field">
      <p>{value | (x + y)}</p>
    </div>
  );
}
