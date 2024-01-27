from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from typing import List
import os
from typing import List, Dict

app = FastAPI()

# 挂载静态文件目录（包含index.html、music和images文件夹）
app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/my_ip")
async def get_photo(request: Request):
    client_host = request.client.host
    return {"client_ip": client_host}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=12345)