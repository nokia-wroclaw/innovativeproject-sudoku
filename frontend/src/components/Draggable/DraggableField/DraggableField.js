import React from "react";
import "./DraggableField.scss";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import ItemTypes from "../ItemTypes";

export default function DraggableField({ value }) {
  const [, drag] = useDrag({
    item: { value, type: ItemTypes.DRAGGABLEFIELD }
  });

  return (
    <div className="draggableField" ref={drag}>
      <p>{value}</p>
    </div>
  );
}

DraggableField.propTypes = {
  value: PropTypes.number
};

DraggableField.defaultProps = {
  value: 0
};
