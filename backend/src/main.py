from fastapi import FastAPI

from .auth import connect_to_db
from .sudokuboard import SudokuBoard
from .routes.auth import auth_router
from .routes.lobby import lobby_router
from .routes.lobby import lobby
from .routes.game import game_router

connect_to_db()

app = FastAPI()

app.include_router(auth_router)
app.include_router(lobby_router)
app.include_router(game_router)


@app.get("/")
async def root():
    return {"message": "Hello World!"}


@app.get("/sudoku")
async def sudoku():
    board = SudokuBoard()
    board.make_puzzle()
    return {"sudokuBoard": board.get_board_matrix()}


@app.on_event("startup")
async def startup():
    # Prime the push notification generator
    await lobby.generator.asend(None)
