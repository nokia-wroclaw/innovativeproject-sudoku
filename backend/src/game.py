import logging
import time
from random import randint
from typing import Dict, List

from starlette.websockets import WebSocket
from websockets.exceptions import ConnectionClosedError

from .sudoku import SudokuPuzzle, check_sudoku

GAME_DURATION = 150
HEAL_VALUE = 20
FIGHT_VALUE = 10

Grid = List[List[int]]


class Player:
    def __init__(self, username):
        self.username = username
        self.endgame_time = time.time() + GAME_DURATION
        self.attacks = 0
        self.heals = 0
        self.start_time = time.time()
        self.level = 1


class Game:
    # this needs a refactor ASAP....
    def __init__(self, usernames: List[str]):
        self.usernames = usernames
        self.generator = self.message_generator()
        self.players: Dict[str, WebSocket] = {}
        self.players_data: Dict[str, Player] = {}
        for p in usernames:
            self.players_data[p] = Player(p)

    def remove(self, username: str) -> None:
        try:
            self.players.pop(username)
            self.usernames.remove(username)
            self.players_data.pop(username)
        except KeyError:
            pass

    def get_time_left(self, username: str) -> float:
        return max(round(self.players_data[username].endgame_time - time.time()), 0.0)

    def get_players_hp(self) -> List[Dict[str, float]]:
        return sorted(
            [
                {"username": username, "time_left": self.get_time_left(username)}
                for username in self.usernames
            ],
            key=lambda item: item["time_left"],
            reverse=True,
        )

    async def message_generator(self) -> None:
        while True:
            message = yield
            await self._send_data(message)

    async def push(self, data: dict) -> None:
        await self.generator.asend(data)

    async def connect(self, websocket: WebSocket, username: str) -> None:
        try:
            await websocket.accept()
            self.players[username] = websocket
            await websocket.send_json(
                {
                    "code": "start",
                    "username": username,
                    "players": self.get_players_hp(),
                    "board": SudokuPuzzle().get_puzzle(),
                    "time_left": self.get_time_left(username),
                }
            )
            logging.info("Player %s connected to game.", username)
        except (ConnectionClosedError, AssertionError):
            logging.warning("ConnectionClosed error - player has disconnected")

    async def _send_data(self, data: dict) -> None:
        active_players: Dict[str, WebSocket] = {}
        while len(self.players) > 0:
            username, ws = self.players.popitem()
            await ws.send_json(data)
            active_players[username] = ws
        self.players = active_players

    async def check_board(self, board: Grid, username: str) -> None:
        logging.info("%s has completed his puzzle.", username)

        response = {
            "time_left": self.get_time_left(username),
        }

        if check_sudoku(board):
            response["code"] = "next_level"
            self.players_data[username].level += 1
            response["board"] = SudokuPuzzle(
                difficulty=self.players_data[username].level
            ).get_puzzle()
        else:
            response["code"] = "incorrect_board"

        await self.players[username].send_json(response)

    async def heal(self, username: str) -> None:
        logging.info("%s is healing.", username)
        player = self.players_data[username]
        player.heals += 1
        player.endgame_time += (
            10 + len(self.usernames) * randint(1, player.level) / 2  # nosec
        )
        await self.players[username].send_json(
            {"code": "heal", "time_left": self.get_time_left(username)}
        )

    async def fight(self, username: str) -> None:
        logging.info("%s is attacking.", username)
        player = self.players_data[username]
        player.attacks += 1
        player.endgame_time += 5 + randint(1, player.level * 2)  # nosec
        for name, enemy in self.players_data.items():
            if name != username:
                enemy.endgame_time -= (
                    10 + len(self.usernames) * randint(1, player.level) / 4  # nosec
                )
                await self.players[name].send_json(
                    {"code": "attacked", "time_left": self.get_time_left(name),}
                )
