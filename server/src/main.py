from fastapi import FastAPI, File, UploadFile, Form
from typing import Annotated
import os

from dotenv import load_dotenv
import mysql.connector

load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST")
MYSQL_ROOT_DATABASE = os.getenv("MYSQL_ROOT_DATABASE")
DB_PORT = os.getenv("DB_PORT")

app = FastAPI()

@app.get("/api/test")
async def root():
  return {"message": "yay its all working"}

@app.get("/api/files")
def getFiles():
  files = []

  cnx = mysql.connector.connect(
    user=DB_USER,
    password=DB_PASS,
    host=DB_HOST,
    database=MYSQL_ROOT_DATABASE,
    port=DB_PORT
  )

  with cnx.cursor(dictionary=True) as cursor:
    res = cursor.execute("SELECT * FROM FILE")
    files.append(cursor.fetchall())

  cnx.close()

  return {"files": files}

@app.post("/api/upload")
async def uploadFile(file: UploadFile):
  filename = file.filename
  file_path = os.path.join("/app/files", filename)

  try:
    fs = await file.read()
    with open(file_path, "wb") as f:
      f.write(file.file.read())

    cnx = mysql.connector.connect(
      user=DB_USER,
      password=DB_PASS,
      host=DB_HOST,
      database=MYSQL_ROOT_DATABASE,
      port=DB_PORT
    )

    with cnx.cursor() as cursor:
        res = cursor.execute("SELECT EMAIL FROM USER ORDER BY RAND() LIMIT 1")
        email = cursor.fetchall()[0][0]
        
        NAME = os.path.splitext(filename)[0]
        EXTENSION = os.path.splitext(str(file_path))[1]
        DESCRIPTION = "a new file"
        INTERNAL_FILE_PATH = file_path
        SIZE_BYES = len(fs)
        UPLOAD_TIME = "DEFAULT"
        ORIGINAL_OWNER_EMAIL = email

        sql = (
          "INSERT INTO FILE VALUES ("
          f" DEFAULT, \"{NAME}\", \"{filename}\", \"{EXTENSION}\","
          f" \"{DESCRIPTION}\", \"{file_path}\", {SIZE_BYES}, DEFAULT,"
          f" \"{email}\", NULL, NULL"
          ")"
        )

        cursor.execute(sql)
        cnx.commit()

    cnx.close()

    return { "filename": filename }
  except Exception as e:
    print(e)
    return { "error": "error saving file", "message": e }

@app.get("/api/user")
def root():
    TABLES = []
    try:
      cnx = mysql.connector.connect(
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        database=MYSQL_ROOT_DATABASE,
        port=DB_PORT
      )

      with cnx.cursor() as cursor:
        res = cursor.execute("SELECT * FROM USER ORDER BY CREATED_AT")
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
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        database=MYSQL_ROOT_DATABASE,
        port=DB_PORT
      )

      print("connected")

      with cnx.cursor() as cursor:
        sql = (
          "INSERT INTO USER "
          "(EMAIL, PASSWORD) "
          f"VALUES (\"{email}\", \"{password}\")"
        )

        cursor.execute(sql)
        cnx.commit()
      cnx.close()
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))

    return {"email": email, "password": password}
