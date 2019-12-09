import React from "react";
import "./CircularMenu.scss";
import PropTypes from "prop-types";

const CircularMenu = ({ itemsAmount, x, y, row, column, updateBoard }) => {
  const tilesArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const displayMenu = () => {
    document.getElementById("circle").classList.toggle("open");
  };

  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div className="circle" id="circle">
        {tilesArray.map((tileValue, key) => {
          return (
            <a
              key={key}
              onClick={() => {
                updateBoard(row, column, tileValue);
                displayMenu();
              }}
              style={{
                position: "absolute",
                left:
                  (
                    45 -
                    35 *
                      Math.cos(
                        -0.5 * Math.PI - 2 * (1 / itemsAmount) * key * Math.PI
                      )
                  ).toFixed(4) + "%",
                top:
                  (
                    47 +
                    35 *
                      Math.sin(
                        -0.5 * Math.PI - 2 * (1 / itemsAmount) * key * Math.PI
                      )
                  ).toFixed(4) + "%"
              }}
            >
              {tileValue}
            </a>
          );
        })}
      </div>
      <a className="menu-button fa fa-bars fa-2x" onClick={displayMenu}></a>
    </div>
  );
};

CircularMenu.propTypes = {};

export default CircularMenu;
