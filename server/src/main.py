from dotenv import load_dotenv
import os

from fastapi import FastAPI

import mysql.connector

load_dotenv()


app = FastAPI()

@app.get("/api/test")
async def root():
  return {"message": "yay its all working"}

@app.get("/api/testdb")
def root():
  TABLES = []
  try:
    cnx = mysql.connector.connect(
      user=os.getenv("DB_USER"),
      password=os.getenv("DB_PASS"),
      host=os.getenv("DB_HOST"),
      database=os.getenv("MYSQL_ROOT_DATABASE"),
      port=os.getenv("DB_PORT")
    )

    with cnx.cursor() as cursor:
      res = cursor.execute("SHOW TABLES")
      for r in cursor.fetchall():
        TABLES.append(r[0])

      cnx.close()
  except mysql.connector.Error as err:
    print("Something went wrong: {}".format(err))
  
  return {"tables": TABLES}

@app.get("/api/user")
async def getUser(name: int = ""):
  return {"message": f"user {name}"}