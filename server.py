from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from typing import List
import os
from typing import List, Dict
import socket
import asyncio


class name_base():
    def __init__(self, file: str = "New.txt"):
        self.file = file
        self.base = {}

    def load(self, name_file: str = None):
        if name_file == None:
            name_file = self.file
        try:
            # 打开文件
            with open(name_file, 'r', encoding='utf-8') as file:
                # 逐行读取文件内容
                for line in file:
                    # 去除行尾的换行符
                    line = line.strip()
                    # 用空格分割学号和名字
                    student_id, student_name = line.split(' ', 1)
                    # 将学号和名字存入字典
                    self.base[student_id] = student_name

        except FileNotFoundError:
            print(f"文件 '{name_file}' 未找到")
        except Exception as e:
            print(f"发生错误: {e}")

    def new(self, ip: str, name: str):
        self.base[ip] = name

    def save(self, output_file: str = None):
        if output_file == None:
            output_file = self.file
        try:
            # 打开文件，如果文件不存在则创建新文件
            with open(output_file, 'w', encoding='utf-8') as file:
                # 遍历字典中的每一项
                for student_id, student_name in self.base.items():
                    # 将学号和名字以空格分隔写入文件
                    file.write(f"{student_id} {student_name}\n")

            print(f"保存成功，内容已写入文件 '{output_file}'")

        except Exception as e:
            print(f"保存失败，发生错误: {e}")

    def name(self, ip: str):
        if ip in self.base:
            return self.base[ip]
        return 0

    def ip(self, name: str):
        if name in self.base.values():
            for key, value in self.base.items():
                if value == name:
                    return key
        else:
            return 0
    def in_ip(self,ip:str):
        return ip in self.base
    def in_name(self,name:str):
        return name in self.base.values()



book = name_base("Test.txt");
book.load()


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
# app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/my_ip")
async def get_photo(request: Request):
    client_host = request.client.host
    return client_host


@app.get("/sign/{name}")
async def sign(request: Request, name: str):
    client_host = request.client.host
    if book.in_ip(client_host):
        return 1
    if book.in_name(name):
        return 2
    print(f"新注册用户({client_host}):{name}")
    book.new(client_host, name)
    book.save()
    return client_host


@app.get("/{page_name}", response_class=HTMLResponse)
async def web(page_name: str):
    # 通过路径参数指定页面名称，读取对应的 HTML 文件内容并返回
    if "." in page_name:
        file_path = f"static/{page_name}"
    else:
        file_path = f"static/{page_name}.html"
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
