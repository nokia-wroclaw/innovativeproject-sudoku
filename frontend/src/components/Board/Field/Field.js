import React from "react";
import "./Field.scss";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import ItemTypes from "../../Dragable/ItemTypes";

export default function Field({ row, col, value }) {
  const [{ number, didDrop }, drop] = useDrop({
    accept: ItemTypes.DRAGABLEFIELD,
    drop: () => ({ value: "DragableField" }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      number: monitor.getDropResult(),
      didDrop: monitor.didDrop()
    })
  });
  if (didDrop) {
    value = number.value;
    console.log("value = ", number.value);
  }

  return (
    <div className="field" ref={drop}>
      <p>{value}</p>
    </div>
  );
}

Field.propTypes = {
  value: PropTypes.number,
  row: PropTypes.number,
  col: PropTypes.number
};

Field.defaultProps = {
  row: 0,
  col: 0,
  value: 0
};
