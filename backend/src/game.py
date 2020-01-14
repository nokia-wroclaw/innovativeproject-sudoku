from typing import List
from starlette.websockets import WebSocket


class Game:
    def __init__(self, usernames):
        print("initialized new game with: ", usernames)
        self.connections: List[WebSocket] = []
        self.usernames: List[str] = usernames
        self.generator = self.message_generator()

    async def message_generator(self):
        while True:
            message = yield
            await self._send_data(message)

    async def push(self, data: str):
        await self.generator.asend(data)

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.connections.append(websocket)
        self.usernames.append(username)

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


def parse_change(input : str):
    print(input)
    return input+"parsed"
