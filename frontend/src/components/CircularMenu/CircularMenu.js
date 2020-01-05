import React, { useState, useEffect } from "react";
import "./CircularMenu.scss";
import PropTypes from "prop-types";
import { isIOS } from "react-device-detect";

const CircularMenu = ({ itemsAmount, suggestions, updateBoard, hideMenu }) => {
  const tilesArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [isOpen, setIsOpen] = useState(false);

  const displayMenu = () => {
    if (isOpen) {
      hideMenu();
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const resetField = () => {
    displayMenu();
    if (isOpen) {
      updateBoard(suggestions.row, suggestions.column, "");
    }
  };

  useEffect(() => {
    if (isIOS) {
      setIsOpen(true);
    }
  }, []);

  return (
    suggestions && (
      <div
        style={{
          position: "absolute",
          left: suggestions.x - 35,
          top: suggestions.y - 35
        }}
      >
        <div id="circle" className={`circle ${isOpen ? "open" : ""}`}>
          {tilesArray.map((tileValue, key) => {
            return (
              <button
                className="circle-button"
                type="button"
                key={key}
                onClick={() => {
                  updateBoard(suggestions.row, suggestions.column, tileValue);
                  displayMenu();
                }}
                style={{
                  position: "absolute",
                  left: `${(
                    48 -
                    35 *
                      Math.cos(
                        -0.5 * Math.PI - 2 * (1 / itemsAmount) * key * Math.PI
                      )
                  ).toFixed(4)}%`,
                  top: `${(
                    48 +
                    35 *
                      Math.sin(
                        -0.5 * Math.PI - 2 * (1 / itemsAmount) * key * Math.PI
                      )
                  ).toFixed(4)}%`
                }}
              >
                {tileValue}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          label="field"
          className="menu-button"
          onClick={resetField}
        />
      </div>
    )
  );
};

CircularMenu.propTypes = {
  suggestions: PropTypes.object.isRequired,
  updateBoard: PropTypes.func.isRequired,
  itemsAmount: PropTypes.number.isRequired,
  hideMenu: PropTypes.func.isRequired
};

export default CircularMenu;
