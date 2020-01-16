import logging
from copy import deepcopy

from typing import Dict, List
from starlette.websockets import WebSocket

from .routes.game import initialize_new_game

LOBBY_SIZE = 2

class Lobby:
    def __init__(self):
        self.players: Dict[str, WebSocket] = {}
        self.generator = self.lobby_message_generator()

    async def lobby_message_generator(self):
        while True:
            message = yield
            await self._send_data(message)

    async def push(self, data: str):
        await self.generator.asend(data)

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.players[username] = websocket
        if len(self.players) == LOBBY_SIZE:
            logging.info("Game start")
            await self.generator.asend("start_game_1234")  
            await initialize_new_game(list(self.players.keys()))

    def remove(self, username):
        self.players.pop(username)

    async def _send_data(self, data: str):
        active_players: Dict[str, WebSocket] = {}
        while len(self.players) > 0:
            username, ws = self.players.popitem()
            await ws.send_text(data)
            active_players[username] = ws
        print(self.players)
        self.players = active_players
