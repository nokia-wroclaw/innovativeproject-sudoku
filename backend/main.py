from fastapi import FastAPI

from src.auth import connect_to_db
from src.sudokuboard import SudokuBoard
from src.routes.auth import auth_router

connect_to_db()

app = FastAPI()

app.include_router(auth_router)


@app.get("/")
async def root():
    return {"message": "Hello World!"}


@app.get("/api/sudoku")
async def sudoku():
    board = SudokuBoard()
    board.make_puzzle()
    return {"sudokuBoard": board.get_board_matrix()}
