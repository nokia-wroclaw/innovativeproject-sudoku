import React from "react";
import "./DragableField.scss";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import ItemTypes from "../ItemTypes";

export default function DragableField({ value }) {
  const [, drag] = useDrag({
    item: { value, type: ItemTypes.DRAGABLEFIELD }
  });

  return (
    <div className="dragableField" ref={drag}>
      <p>{value}</p>
    </div>
  );
}

DragableField.propTypes = {
  value: PropTypes.number
};

DragableField.defaultProps = {
  value: 0
};
