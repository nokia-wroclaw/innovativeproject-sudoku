from fastapi import Cookie, Depends, Header, APIRouter
from starlette.responses import HTMLResponse
from starlette.status import WS_1008_POLICY_VIOLATION
from starlette.websockets import WebSocket
from starlette.endpoints import WebSocketEndpoint, HTTPEndpoint
from pydantic import BaseModel


router=APIRouter()


class Player(BaseModel):
    nick: str
    token: str


@router.websocket_route("/gamelobby")
class Echo(WebSocketEndpoint):
    async def on_connect(self, websocket):
        await websocket.accept()
        await websocket.send_text(f"New player connected")

    async def on_receive(self, websocket, data):
        await websocket.send_text(f"Message text was: {data}")

    async def on_disconnect(self, websocket, close_code):
        await websocket.send_text(f"Player disconnected")
        pass
