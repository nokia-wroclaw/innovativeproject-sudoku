import React from "react"
import ReactDOM from "react-dom"
import "./BoardElement.scss"

export default function BoardElement({fields}) {
    return (
        <div className="boardElement" key={key}>
            <p>{fields}</p>
        </div>
    )
}