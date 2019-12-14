import React from "react";
import styles from "./Field.scss";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import ItemTypes from "../../Draggable/ItemTypes";

export default function Field({ value, onDrop, style }) {
  
  const [{canDrop, isOver}, drop] = useDrop({
    accept: ItemTypes.DRAGGABLEFIELD,
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const darker = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  let background = styles.boardColor

  if(isOver && canDrop){
    background = darker(styles.boardColor, -80)

  }

  return (
    <div className="field" ref={drop} style={{...style, background}}>
      <p>{value}</p>
    </div>
  );
}

Field.propTypes = {
  value: PropTypes.number.isRequired,
  onDrop: PropTypes.func.isRequired,
  style: PropTypes.object
};

Field.defaultProps = {
  style: {}
};
