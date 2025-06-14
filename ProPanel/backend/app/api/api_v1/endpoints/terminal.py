import os
import asyncio
import pty
import select
import threading
from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
from app.api import deps

router = APIRouter()

@router.websocket("/ws")
async def websocket_terminal(
    websocket: WebSocket,
    current_user=Depends(deps.get_current_active_superuser)
):
    await websocket.accept()
    master_fd, slave_fd = pty.openpty()

    pid = os.fork()
    if pid == 0:
        os.setsid()
        os.dup2(slave_fd, 0)
        os.dup2(slave_fd, 1)
        os.dup2(slave_fd, 2)
        os.execv("/bin/bash", ["/bin/bash"])
    else:
        loop = asyncio.get_running_loop()
        def read_from_pty():
            while True:
                try:
                    rl, _, _ = select.select([master_fd], [], [], 0.1)
                    if rl:
                        data = os.read(master_fd, 1024)
                        if data:
                            asyncio.run_coroutine_threadsafe(
                                websocket.send_bytes(data), loop)
                except Exception:
                    break
        t = threading.Thread(target=read_from_pty, daemon=True)
        t.start()
        try:
            while True:
                data = await websocket.receive_bytes()
                os.write(master_fd, data)
        except WebSocketDisconnect:
            pass
        except Exception:
            pass
        finally:
            os.close(master_fd)
            os.kill(pid, 9)
