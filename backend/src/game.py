import logging
import json
import time
from typing import Dict, List
from starlette.websockets import WebSocket
from websockets.exceptions import ConnectionClosedError
from .sudokuboard import check_sudoku

GAME_DURATION = 120.0
TIME_ADD_AFTER_SOLVE = 5


class Player:
    def __init__(self, username):
        self.username = username
        self.timer = time.time() + GAME_DURATION


class Game:
    def __init__(self, usernames):
        self.connections: List[WebSocket] = []
        self.usernames: List[str] = usernames
        self.generator = self.message_generator()
        self.players: Dict[str, WebSocket] = {}
        self.players_data: Dict[str, Player] = {}
        for p in usernames:
            self.players_data[p] = Player(p)

    async def message_generator(self):
        while True:
            message = yield
            await self._send_data(message)

    async def push(self, data: str):
        await self.generator.asend(data)

    async def connect(self, websocket: WebSocket, username: str):
        try:
            await websocket.accept()
        except ConnectionClosedError:
            logging.warning("ConnectionClosed error - player has disconnected")
        except AssertionError:
            logging.warning("ConnectionClosed error - player has disconnected")
        self.players[username] = websocket
        logging.info("Player %s connected to game.", username)

    def remove(self, username):
        try:
            self.players.pop(username)
            self.usernames.remove(username)
            self.players_data[username].timer = -1.0
        except KeyError:
            pass

    async def _send_data(self, data: str):
        # pylint: disable=duplicate-code
        active_players: Dict[str, WebSocket] = {}
        while len(self.players) > 0:
            username, ws = self.players.popitem()
            await ws.send_text(data)
            active_players[username] = ws
        self.players = active_players

    async def handle_data(self, data, username):
        parsed_data = json.loads(data)
        if "board" in parsed_data:
            self.players_data[username].timer += TIME_ADD_AFTER_SOLVE
            time_delta = self.players_data[username].timer - time.time()
            temp = json.dumps(
                {
                    "boardSolved": check_sudoku(parsed_data["board"]),
                    "timeLeft": time_delta,
                }
            )
        try:
            await self.players[username].send_json(temp)
        except ConnectionClosedError:
            pass
