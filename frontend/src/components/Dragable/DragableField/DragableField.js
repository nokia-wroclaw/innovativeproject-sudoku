import React from "react";
import "./DragableField.scss";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import ItemTypes from "../ItemTypes";

export default function DragableField({ value }) {
  const [{ isDragging }, drag] = useDrag({
    item: { number: 1, type: ItemTypes.DRAGABLEFIELD }
  });
  const opacity = isDragging ? 0.9 : 1;
  return (
    <div className="field" ref={drag}>
      <p>{value}</p>
    </div>
  );
}

DragableField.propTypes = {
  value: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  id: PropTypes.number
};

DragableField.defaultProps = {
  x: 0,
  y: 0,
  value: 0,
  id: 0
};
