import logging
import time
from typing import Dict, List
from starlette.websockets import WebSocket
from websockets.exceptions import ConnectionClosedError
from .sudokuboard import check_sudoku

GAME_DURATION = 140.0
TIME_ADD_AFTER_SOLVE = 5


class Player:
    def __init__(self, username):
        self.username = username
        self.timer = time.time() + GAME_DURATION


class Game:
    def __init__(self, usernames: List[str]):
        self.connections: List[WebSocket] = []
        self.usernames = usernames
        self.generator = self.message_generator()
        self.players: Dict[str, WebSocket] = {}
        self.players_data: Dict[str, Player] = {}
        for p in usernames:
            self.players_data[p] = Player(p)

    async def message_generator(self):
        while True:
            message = yield
            await self._send_data(message)

    async def push(self, data: dict):
        await self.generator.asend(data)

    async def connect(self, websocket: WebSocket, username: str):
        try:
            await websocket.accept()
            self.players[username] = websocket
            logging.info("Player %s connected to game.", username)
        except (ConnectionClosedError, AssertionError):
            logging.warning("ConnectionClosed error - player has disconnected")

    def remove(self, username):
        try:
            self.players.pop(username)
            self.usernames.remove(username)
            self.players_data[username].timer = -1.0
        except KeyError:
            pass

    async def _send_data(self, data: dict):
        # pylint: disable=duplicate-code
        active_players: Dict[str, WebSocket] = {}
        while len(self.players) > 0:
            username, ws = self.players.popitem()
            await ws.send_json(data)
            active_players[username] = ws
        self.players = active_players

    async def handle_board(self, data, username):
        self.players_data[username].timer += TIME_ADD_AFTER_SOLVE
        time_delta = self.players_data[username].timer - time.time()
        logging.info(time_delta)
        try:
            if check_sudoku(data):
                await self.players[username].send_json(
                    {"type": "event", "code": "next_level", "time_left": time_delta,}
                )
            else:
                await self.players[username].send_json(
                    {
                        "type": "event",
                        "code": "incorrect_board",
                        "time_left": time_delta,
                    }
                )
        except ConnectionClosedError:
            pass
