import React from "react"
import ReactDOM from "react-dom"
import "./Field.scss"

export default function Field({x, y, value}) {
    return (
        <div className="field">
<<<<<<< HEAD
            <p>{value | x+y}</p>
=======
            <p>{x+y | value}</p>
>>>>>>> Drag panel preparations.
        </div>
    )
}
