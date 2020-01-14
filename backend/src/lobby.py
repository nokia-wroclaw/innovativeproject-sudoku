import logging

from typing import List
from starlette.websockets import WebSocket

from .routes.game import initialize_new_game

LOBBY_SIZE = 3


class Lobby:
    def __init__(self):
        self.connections: List[WebSocket] = []
        self.usernames: List[str] = []
        self.generator = self.lobby_message_generator()

    async def lobby_message_generator(self):
        while True:
            message = yield
            await self._send_data(message)

    async def push(self, data: str):
        await self.generator.asend(data)

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.connections.append(websocket)
        self.usernames.append(username)
        if len(self.connections) >= LOBBY_SIZE:
            logging.info("Game start")
            await self.generator.asend("start_game_1234")
            initialize_new_game(self.usernames)

    def remove(self, websocket: WebSocket, username):
        self.connections.remove(websocket)
        self.usernames.remove(username)

    async def _send_data(self, data: str):
        living_connections = []
        while len(self.connections) > 0:
            websocket = self.connections.pop()
            await websocket.send_text(data)
            living_connections.append(websocket)
        self.connections = living_connections


