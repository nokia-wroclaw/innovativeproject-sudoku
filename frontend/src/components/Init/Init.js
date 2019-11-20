import "./Init.css";
import React from "react";
import PropTypes from "prop-types";

function Init({ text }) {
  return (
    <div data-testid="container" className="center">
      <h1 data-testid="text">{text}</h1>
    </div>
  );
}

Init.propTypes = {
  text: PropTypes.string.isRequired
};

export default Init;
