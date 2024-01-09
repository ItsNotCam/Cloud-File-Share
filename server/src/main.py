from fastapi import FastAPI

app = FastAPI()

@app.get("/api/test")
async def root():
  return {"message": "yay its all working"}

@app.get("/api/user")
def test():
  return {"lol": "ok"}