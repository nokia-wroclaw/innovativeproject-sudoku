from fastapi import FastAPI

from src.auth import connect_to_db
from src.sudokuboard import SudokuBoard, Difficulty
from src.routes.auth import auth_router
from src.routes.lobby import lobby_router
from src.routes.lobby import lobby
from src.routes.game import game_router

connect_to_db()

app = FastAPI()

app.include_router(auth_router)
app.include_router(lobby_router)
app.include_router(game_router)


@app.get("/")
async def root():
    return {"message": "Hello World!"}


@app.get("/api/sudoku")
async def sudoku():
    board = SudokuBoard(difficulty=Difficulty.TEST_SIMPLE)
    board.make_puzzle()
    return {"sudokuBoard": board.get_board_matrix()}


@app.on_event("startup")
async def startup():
    # Prime the push notification generator
    await lobby.generator.asend(None)
