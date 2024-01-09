from typing import Annotated
from dotenv import load_dotenv
import os

from fastapi import FastAPI, Form
from pydantic import BaseModel

import mysql.connector

load_dotenv()


app = FastAPI()

@app.get("/api/test")
async def root():
  return {"message": "yay its all working"}

@app.get("/api/user")
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
      res = cursor.execute("SELECT * FROM USER")
      for r in cursor.fetchall():
        ok = []
        for a in r:
          ok.append(a)

        TABLES.append(ok)

      cnx.close()
  except mysql.connector.Error as err:
    print("Something went wrong: {}".format(err))
  
  return {"tables": TABLES}
  
@app.post("/api/user")
async def setUser(email: Annotated[str, Form()], password: Annotated[str, Form()]):
  print(f"{email} - {password}")

  try:
    cnx = mysql.connector.connect(
      user=os.getenv("DB_USER"),
      password=os.getenv("DB_PASS"),
      host=os.getenv("DB_HOST"),
      database=os.getenv("MYSQL_ROOT_DATABASE"),
      port=os.getenv("DB_PORT")
    )

    print("connected")

    with cnx.cursor() as cursor:
      data = {
        'email': email, 
        'password': password
      }

      sql = (
        "INSERT INTO USER "
        "(EMAIL, PASSWORD) "
        f"VALUES (\"{email}\", \"{password}\")"
      )

      res = cursor.execute(sql)
      cnx.commit()
    cnx.close()
  except mysql.connector.Error as err:
    print("Something went wrong: {}".format(err))

  return {"email": email, "password": password}