import React from "react";
import ReactDOM from "react-dom";
import "./GameView.scss"
import Board from "../Board/Board"
import DragPanel from "../DragPanel/DragPanel"

class GameView extends React.Component {
    
    render(){
        return(<div>  
                    <Board/>
                    <DragPanel/>
                </div>
        );
    }
}

export default GameView;