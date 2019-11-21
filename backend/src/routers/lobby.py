from fastapi import APIRouter
from starlette.endpoints import WebSocketEndpoint

SESSION_SIZE = 3


router = APIRouter()


@router.websocket_route("/gamelobby")
class Echo(WebSocketEndpoint):
    async def on_connect(self, websocket):
        await websocket.accept()
        await websocket.send_text(f"New player connected")

    async def on_receive(self, websocket, data):
        await websocket.send_text(f"Message text was: {data}")

    async def on_disconnect(self, websocket, close_code):
        await websocket.send_text(f"Player disconnected")
