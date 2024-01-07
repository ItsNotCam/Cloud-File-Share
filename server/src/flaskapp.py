from dotenv import load_dotenv
from pathlib import Path
import mysql.connector
import os

from flask import Flask
from flask_restful import Api, Resource

load_dotenv()
TABLES = []

cnx = mysql.connector.connect(
  user=os.getenv("DB_USER"),
  password=os.getenv("DB_PASS"),
  host=os.getenv("DB_HOST"),
  database=os.getenv("MYSQL_DATABASE"),
  port=os.getenv("DB_PORT")
)

with cnx.cursor() as cursor:
  res = cursor.execute("SHOW TABLES")
  for r in cursor.fetchall():
    print(r[0])
    TABLES.append(r[0])

  cnx.close()

app = Flask(__name__)
api = Api(app)

class HelloWorld(Resource):
  def get(self):
    return { 'ok': TABLES }
  
api.add_resource(HelloWorld, '/ok')

if __name__ == '__main__':
  app.run(debug=True)