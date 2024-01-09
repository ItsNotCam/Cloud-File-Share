from typing import Annotated
from fastapi import Formt
from dotenv import load_dotenv
import os
import mysql.connector


load_dotenv()
DB_USER = os.getenv("DB_USER"),
DB_PASS = os.getenv("DB_PASS"),
DB_HOST = os.getenv("DB_HOST"),
MYSQL_ROOT_DATABASE = os.getenv("MYSQL_ROOT_DATABASE"),
DB_PORT = os.getenv("DB_PORT")

class User:
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
