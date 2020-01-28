import logging
from typing import Dict, List

from starlette.websockets import WebSocket, WebSocketDisconnect
from websockets.exceptions import ConnectionClosedError, ConnectionClosedOK

from .routes.game import initialize_new_game

LOBBY_TIMEOUT = 16.0
LOBBY_SIZE = 4
MIN_PLAYERS = 3


class Lobby:
    def __init__(self):
        self.players: Dict[str, WebSocket] = {}
        self.generator = self.lobby_message_generator()
        self.timer_started = False
        self.timer_end = 1.0

    async def lobby_message_generator(self):
        while True:
            message = yield
            await self._send_data(message)

    async def push(self, data):
        await self.generator.asend(data)

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.players[username] = websocket
        await websocket.send_json({"code": "enter_lobby", "timer_limit": LOBBY_TIMEOUT})
        await self.push({"code": "players", "players": sorted(self.get_usernames())})
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
            except (ConnectionClosedError, ConnectionClosedOK, WebSocketDisconnect):
                self.remove(username)
        self.players = active_players

    def get_usernames(self) -> List[str]:
        usernames = list(self.players.keys())
        return usernames
