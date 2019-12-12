import json

from typing import List
from starlette.websockets import WebSocket


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
            print("start")
            await self.generator.asend("game start")

    def remove(self, websocket: WebSocket, username):
        self.connections.remove(websocket)
        self.usernames.remove(username)

    async def _send_data(self, data: str):
        living_connections = []
        while len(self.connections) > 0:
            websocket = self.connections.pop()
            await websocket.send_text(data)
            await websocket.send_json(json.dumps(self.usernames))
            living_connections.append(websocket)
        self.connections = living_connections
