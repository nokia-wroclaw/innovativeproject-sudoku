import React, { useState } from "react";
import "./CircularMenu.scss";
import PropTypes from "prop-types";

const CircularMenu = ({
  itemsAmount,
  x,
  y,
  row,
  column,
  updateBoard,
  hideMenu
}) => {
  const tilesArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [opened, setOpened] = useState(false);

  const displayMenu = () => {
    if (opened) {
      hideMenu();
      setOpened(false);
    } else {
      document.getElementById("circle").classList.toggle("open");
      setOpened(true);
    }
  };

  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div className="circle" id="circle">
        {tilesArray.map((tileValue, key) => {
          return (
            <button
              type="button"
              key={key}
              onClick={() => {
                updateBoard(row, column, tileValue);
                displayMenu();
              }}
              style={{
                position: "absolute",
                left: `${(
                  45 -
                  35 *
                    Math.cos(
                      -0.5 * Math.PI - 2 * (1 / itemsAmount) * key * Math.PI
                    )
                ).toFixed(4)}%`,
                top: `${(
                  47 +
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
        className="menu-button fa fa-bars fa-2x"
        onClick={displayMenu}
      />
    </div>
  );
};

CircularMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
  updateBoard: PropTypes.func.isRequired,
  itemsAmount: PropTypes.number.isRequired,
  hideMenu: PropTypes.func.isRequired
};

export default CircularMenu;
