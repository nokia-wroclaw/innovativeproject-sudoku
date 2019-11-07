import React from "react";
import ReactDOM from "react-dom";
import "./Board.scss";
import Field from "./Field/Field";
import DragPanel from "../DragPanel/DragPanel";

class Board extends React.Component {
  renderField = key => {
    const x = key % 9;
    const y = Math.floor(key / 9);
    return <Field x={x} y={y} key={key} />;
  };

  generateBoard = () => {
    const fields = [];
    for (let x = 0; x < 81; x++) {
      fields.push(this.renderField(x));
    }
    return <div className="board">{fields}</div>;
  };

  render() {
    return <div className="card">{this.generateBoard()}</div>;
  }
}

export default Board;
