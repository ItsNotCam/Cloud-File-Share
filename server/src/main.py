from fastapi import FastAPI, File, UploadFile
from typing import Annotated
import os

app = FastAPI()

@app.get("/api/test")
async def root():
  return {"message": "yay its all working"}

@app.get("/api/user")
def test():
  return {"lol": "ok"}

@app.post("/api/upload")
async def uploadFile(file: UploadFile):
  filename = file.filename
  
  file_path = os.path.join("/app/files", filename)
  print(file_path)

  try:
    with open(file_path, "wb") as f:
      f.write(file.file.read())
    return { "filename": filename }
  except Exception as e:
    print(e)
    return { "error": "error saving file", "message": e }