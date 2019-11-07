import React from "react";
import "./Field.scss";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import ItemTypes from "../../Dragable/ItemTypes";

export default function Field({ x, y, value }) {
  const [{ canDrop, isOver, number, didDrop }, drop] = useDrop({
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
  x: PropTypes.number,
  y: PropTypes.number
};

Field.defaultProps = {
  x: 0,
  y: 0,
  value: 0
};
