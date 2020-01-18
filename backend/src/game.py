import logging
import json

from typing import Dict, List
from starlette.websockets import WebSocket
from websockets.exceptions import ConnectionClosedError

class Player:
    def __init__(self, username):
        self.username = username
        self.time = t

    async def timer(self):
        self.time-=1


class Game:
    def __init__(self, usernames):
        print("initialized new game with: ", usernames)
        self.connections: List[WebSocket] = []
        self.usernames: List[str] = usernames
        self.generator = self.message_generator()
        self.players: Dict[str, WebSocket] = {}

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
            logging.info("ConnectionClosed error - player has disconnected")
        except AssertionError:
            logging.info("ConnectionClosed error - player has disconnected")
        self.players[username] = websocket
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
    
    #async def handle_data(self, data):


