import React from "react";
import styles from "./Field.scss";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import ItemTypes from "../../Draggable/ItemTypes";

export default function Field({ value, onDrop, isSelected, recived }) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: recived ? ItemTypes.BLOCKEDFIELD : ItemTypes.DRAGGABLEFIELD,
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  let background;
  let opacity;

  const darker = (color, amount) => {
    return (
      "#" +
      color
        .replace(/^#/, "")
        .replace(/../g, color =>
          (
            "0" +
            Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
              16
            )
          ).substr(-2)
        )
    );
  };

  if ((isOver && canDrop) || isSelected) {
    background = styles.fieldHighlight;
    opacity = 0.9;
  } else if (recived) {
    background = darker(styles.boardColor, -50);
  }

  return (
    <div className="field" ref={drop} style={{ background, opacity }}>
      <p>{value}</p>
    </div>
  );
}

Field.propTypes = {
  value: PropTypes.number.isRequired,
  onDrop: PropTypes.func,
  isSelected: PropTypes.bool.isRequired
};

Field.defaultProps = {
  onDrop: null
};
