import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Videos are located in the parent folder's public directory
BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = BASE_DIR / "public"

def stream_file(file_path: Path, start: int, end: int, chunk_size: int = 1024 * 1024):
    with open(file_path, "rb") as f:
        f.seek(start)
        remaining = end - start + 1
        while remaining > 0:
            chunk = f.read(min(chunk_size, remaining))
            if not chunk:
                break
            remaining -= len(chunk)
            yield chunk

@app.get("/api/video")
async def get_video(path: str, request: Request):
    if path.startswith("/"):
        path = path[1:]
        
    file_path = PUBLIC_DIR / path
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Video not found")
        
    file_size = file_path.stat().st_size
    range_header = request.headers.get("range")
    
    if range_header:
        # Expected format: "bytes=start-end"
        byte_range = range_header.strip().replace("bytes=", "").split("-")
        start = int(byte_range[0])
        end = int(byte_range[1]) if len(byte_range) > 1 and byte_range[1] else file_size - 1
    else:
        start = 0
        end = file_size - 1
        
    if start >= file_size or end >= file_size:
        raise HTTPException(status_code=416, detail="Requested Range Not Satisfiable")
        
    content_length = end - start + 1
    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(content_length),
        "Content-Type": "video/mp4",
    }
    
    return StreamingResponse(
        stream_file(file_path, start, end),
        status_code=206,
        headers=headers
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
