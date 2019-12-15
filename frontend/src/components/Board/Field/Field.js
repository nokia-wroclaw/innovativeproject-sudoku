import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import styles from "./Field.scss";
import ItemTypes from "../../Draggable/ItemTypes";

export default function Field({ value, onDrop, isSelected, recived, onClick }) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: recived ? ItemTypes.BLOCKEDFIELD : ItemTypes.DRAGGABLEFIELD,
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const [displayTrash, setDisplayTrash] = useState(false);

  let background;

  const darker = (hexColor, amount) => {
    return `#${hexColor
      .replace(/^#/, "")
      .replace(/../g, color =>
        `0  ${Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
          16
        )}`.substr(-2)
      )}`;
  };

  if ((isOver && canDrop) || isSelected) {
    background = styles.fieldHighlight;
  } else if (recived) {
    background = darker(styles.boardColor, -30);
  }

  return (
    <div
      className="field"
      ref={drop}
      style={{
        background
      }}
      onKeyDown={onClick}
      onMouseEnter={
        recived
          ? null
          : () => {
              setDisplayTrash(true);
            }
      }
      onMouseLeave={
        recived
          ? null
          : () => {
              setDisplayTrash(false);
            }
      }
      role="button"
      tabIndex="0"
    >
      {displayTrash && value ? (
        <i className="fas fa-trash trash" onClick={onClick} />
      ) : (
        <p> {value} </p>
      )}
    </div>
  );
}

Field.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onDrop: PropTypes.func,
  isSelected: PropTypes.bool,
  recived: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};

Field.defaultProps = {
  onDrop: null,
  isSelected: false,
  onClick: null
};
