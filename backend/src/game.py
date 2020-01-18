import logging
import json
import time
from typing import Dict, List
from starlette.websockets import WebSocket
from websockets.exceptions import ConnectionClosedError
from .sudokuboard import check_sudoku

GAME_DURATION = 120.0


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
        if self.players_data.get(username):
            logging.info("Player %s reconnected to game.", username)
            return
        new_player = Player(username)
        self.players_data[username] = new_player
        logging.info("Player %s connected to game.", username)

    def remove(self, username):
        try:
            self.players.pop(username)
        except KeyError:
            pass
    
    async def _send_data(self, data: str):
        active_players: Dict[str, WebSocket] = {}
        while len(self.players) > 0:
            username, ws = self.players.popitem()
            await ws.send_text(data)
            active_players[username] = ws
        self.players = active_players
    
    async def handle_data(self, data, username):
        #print(data)
        parsed_data = json.loads(data)
        time_delta = self.players_data[username].timer-time.time()
        temp = json.dumps({"timeLeft": time_delta, "test": "test_value"})
        if 'board' in parsed_data:
            print(check_sudoku(parsed_data['board']))

        await self.players[username].send_json(temp)



