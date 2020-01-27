import logging
from time import time
from typing import Dict, List

from websockets.exceptions import ConnectionClosedError
from starlette.websockets import WebSocket

from .routes.game import initialize_new_game

LOBBY_SIZE = 3


class Lobby:
    def __init__(self):
        self.players: Dict[str, WebSocket] = {}
        self.generator = self.lobby_message_generator()
        self.timer_started = False
        self.timer_end = time()

    async def lobby_message_generator(self):
        while True:
            message = yield
            await self._send_data(message)

    async def push(self, data):
        await self.generator.asend(data)

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.players[username] = websocket
        await self.push({"code": "players", "players": self.get_usernames()})
        if len(self.players) == LOBBY_SIZE:
            logging.info("Game start")
            await self.push({"code": "start_game"})
            self.timer_started = False
            await initialize_new_game(list(self.players.keys()))

    def remove(self, username):
        try:
            self.players.pop(username)
        except KeyError:
            pass

    async def _send_data(self, data: str):
        active_players: Dict[str, WebSocket] = {}
        while len(self.players) > 0:
            try:
                username, ws = self.players.popitem()
                await ws.send_json(data)
                active_players[username] = ws
            except ConnectionClosedError:
                self.remove(username)
        self.players = active_players

    def get_usernames(self) -> List[str]:
        usernames = list(self.players.keys())
        logging.info(usernames)
        return usernames
