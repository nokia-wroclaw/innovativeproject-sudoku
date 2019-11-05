import React from "react"
import "./DragPanel.scss"
import Field from "../Board/Field/Field"

const renderField = (value) => {
    return <Field value={value} key={value}/>; 
}

const generatePanel = () => {
    const fields = []
    for (let i=0; i<9; i++){
        fields.push(renderField(i))   
    }
    return fields
}

export default function DragPanel() {
    return generatePanel()
}
