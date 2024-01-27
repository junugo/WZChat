from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from typing import List
import os
from typing import List, Dict
import socket
import asyncio

def get_local_ip():
    try:
        # 创建一个套接字
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # 连接到一个外部地址，这里使用谷歌的DNS服务器
        s.connect(('8.8.8.8', 80))
        # 获取本地IP地址
        local_ip = s.getsockname()[0]
        return local_ip
    except Exception as e:
        print(f"获取本地IP地址失败：{e}")
        return None
    finally:
        # 关闭套接字连接
        s.close()

# 获取本地IP地址并打印
local_ip = get_local_ip()
if local_ip:
    print(f"本地IP地址为: {local_ip}")

app = FastAPI()

# 挂载静态文件目录（包含index.html、music和images文件夹）
#app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/my_ip")
async def get_photo(request: Request):
    client_host = request.client.host
    return client_host

@app.get("/{page_name}", response_class=HTMLResponse)
async def web(page_name: str):
    # 通过路径参数指定页面名称，读取对应的 HTML 文件内容并返回
    if "." in page_name:
        file_path = f"static/{page_name}"
    else:
        #file_path = f"static/{page_name}.html"
        file_path = f"static/Sign.html"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        # 如果文件不存在，返回一个简单的错误页面
        return FileResponse("static/Error.html")

@app.get("/", response_class=HTMLResponse)
async def index():
    return FileResponse("static/Sign.html")

async def run_server(host, port):
    config = uvicorn.Config(app, host=host, port=port)
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    loop = asyncio.get_event_loop()

    # 启动第一个服务器
    server1 = run_server(local_ip, 8000)

    # 启动第二个服务器
    server2 = run_server("127.0.0.1", 8001)

    # 运行事件循环
    try:
        loop.run_until_complete(asyncio.gather(server1, server2))
    finally:
        loop.close()