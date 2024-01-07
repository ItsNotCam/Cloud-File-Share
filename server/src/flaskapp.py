from dotenv import load_dotenv
from pathlib import Path
import mysql.connector
import os

load_dotenv()

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

  cnx.close()

# app = Flask(__name__)
# api = Api(app)

# class HelloWorld(Resource):
#   def get(self):
#     return { 'hello': 'world' }
  
# api.add_resource(HelloWorld, '/')

# if __name__ == '__main__':
#   app.run(debug=True)