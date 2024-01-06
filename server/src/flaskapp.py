from dotenv import load_dotenv
from pathlib import Path
import mysql.connector
import os

dotenv_path=Path('/home/cam/gdrive/config.env')
load_dotenv(dotenv_path=dotenv_path)

cnx = mysql.connector.connect(
  user=os.getenv("MYSQL_USER"),
  password=os.getenv("MYSQL_PASSWORD"),
  host=os.getenv("DB_HOST"),
  database=os.getenv("MYSQL_DATABASE")
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