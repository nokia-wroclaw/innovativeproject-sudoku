import React from "react";
import "./Field.scss";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import ItemTypes from "../../Draggable/ItemTypes";

export default function Field({ value, onDrop }) {
  const [, drop] = useDrop({
    accept: ItemTypes.DRAGGABLEFIELD,
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return (
    <div className="field" ref={drop}>
      <p>{value}</p>
    </div>
  );
}

Field.propTypes = {
  value: PropTypes.number.isRequired,
  onDrop: PropTypes.func.isRequired
};
