import React from "react";
import PropTypes from "prop-types";
import styles from "./Field.scss";

export default function Field({ value, blocked, isSelected, onClick }) {
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

  if (blocked) {
    background = darker(styles.boardColor, -30);
  } else if (isSelected) {
    background = styles.fieldHighlight;
  }

  return (
    <div
      className="field"
      style={{ background }}
      onKeyDown={onClick}
      role="button"
      tabIndex="0"
      onClick={onClick}
    >
      <p> {value} </p>
    </div>
  );
}

Field.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  blocked: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool.isRequired
};

Field.defaultProps = {
  onClick: null
};
