import asyncio
import asyncio.exceptions
import logging
import time
from asyncio import wait_for
from typing import List

from fastapi import APIRouter
from starlette.websockets import WebSocket, WebSocketDisconnect
from websockets.exceptions import ConnectionClosedError

from ..auth import CookieVerificationError, verify_cookies
from ..game import Game
from .stats import update_stats

game_router = APIRouter()
games: List[Game] = []


@game_router.websocket("/game")
async def websocket_endpoint(websocket: WebSocket):
    try:
        username = verify_cookies(websocket.cookies, name="access_token")
    except CookieVerificationError:
        logging.info("Cookie verification failed.")
        return

    game = None
    for g in games:
        if username in g.usernames:
            await g.connect(websocket, username)
            game = g
    if game is None:
        await websocket.accept()
        await websocket.send_json({"code": "no_game"})
        logging.info(
            "Player: %s tried to connect /game, but no game was found with him.",
            username,
        )
        return

    while True:
        try:
            data = []  # a wrapper to achieve _pass_by_reference_
            await wait_for(get_data(websocket, data), timeout=0.5)
            if data[0]["code"] == "check_board":
                await game.check_board(data[0]["board"], username)
            elif data[0]["code"] == "heal":
                await game.heal(username)
            elif data[0]["code"] == "fight":
                await game.fight(username)
        except asyncio.TimeoutError:
            await check_timers(websocket, username, game)
            await game.push({"code": "players", "players": game.get_players_hp()})
        except (WebSocketDisconnect, ConnectionClosedError):
            update_stats(game.players_data[username], username, False)
            game.remove(username)
            if len(game.players) == 0 and game in games:
                games.remove(game)


async def initialize_new_game(usernames):
    game = Game(usernames)
    await game.generator.asend(None)
    games.append(game)


def check_if_in_game(username):
    for g in games:
        if username in g.usernames:
            return True
    return False


async def get_data(websocket, wrapper):
    data = await websocket.receive_json()
    wrapper.append(data)


async def check_timers(websocket, username, game):
    if len(game.usernames) == 1 and game.usernames[0] == username:
        await websocket.send_json({"code": "game_won"})
        update_stats(game.players_data[username], username, True)
        game.remove(username)

    for name, player in game.players_data.copy().items():
        if player.endgame_time <= time.time():
            update_stats(player, name, False)
            await game.players[name].send_json({"code": "game_lost"})
            logging.info("time out on player %s", username)
            game.remove(name)
