import React from "react";
import "./Field.scss";
import PropTypes from "prop-types";

export default function Field({ x, y, value }) {
  return (
    <div className="field">
      <p>{value === 0 ? "" : value}</p>
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
