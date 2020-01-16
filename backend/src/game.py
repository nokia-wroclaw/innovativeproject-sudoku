import logging
import json

from typing import Dict, List
from starlette.websockets import WebSocket


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
        await websocket.accept()
        self.players[username] = websocket
        logging.info("Player %s connected to game.", username)

    def remove(self, username):
            self.players.pop(username)
            
    async def _send_data(self, data: str):
        active_players: Dict[str, WebSocket] = {}
        while len(self.players) > 0:
            username, ws = self.players.popitem()
            await ws.send_text(data)
            active_players[username] = ws
        self.players = active_players
    
    #async def handle_data(self, data):

