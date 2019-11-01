import "./Init.css";
import React from "react";

function Init(props) {
    return (
        <div data-testid='container' className="center">
            <h1 data-testid='text'>{props.text}</h1>
        </div>
    );
}

export default Init;
