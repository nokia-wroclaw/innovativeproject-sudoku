from fastapi import FastAPI

from .sudokuboard import SudokuBoard

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World!"}


@app.get("/sudoku")
async def sudoku():
    board = SudokuBoard()
    return {"sudokuBoard": board.get_board_matrix()}
