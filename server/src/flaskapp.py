from dotenv import load_dotenv
import os

from flask import Flask, request
from flask_restful import Api, Resource, reqparse

import mysql.connector


load_dotenv()
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

app = Flask(__name__)
api = Api(app)

class Tables(Resource):
  def get(self):
    return { 'tables': TABLES }

class TestConnection(Resource):    
  def get(self):
    return { "success": "good its working"}


class ManageUsers(Resource):
  def get(self):
    users = []
    try:
      cnx = mysql.connector.connect(
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        host=os.getenv("DB_HOST"),
        database=os.getenv("MYSQL_ROOT_DATABASE"),
        port=os.getenv("DB_PORT")
      )

      with cnx.cursor() as cursor:
        res = cursor.execute("SELECT EMAIL FROM USER;")
        for r in cursor.fetchall():
          users.append(r[0])

        cnx.close()
    except mysql.connector.Error as err:
      print("Something went wrong: {}".format(err))

    return { "users": users }
  
  def post(self):
    # parser = reqparse.RequestParser()
    # parser.add_argument("email")
    # parser.add_argument("password")
    # args = parser.parse_args()

    # print(request.form['email'])
    # print(request.form['password'])

    data = request.form

    email = data.get('email')
    password = data.get('password')

    try:
      cnx = mysql.connector.connect(
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        host=os.getenv("DB_HOST"),
        database=os.getenv("MYSQL_ROOT_DATABASE"),
        port=os.getenv("DB_PORT")
      )

      with cnx.cursor() as cursor:
        # res = cursor.execute("SELECT EMAIL FROM USER;")
        res = cursor.execute(f"INSERT INTO USER (EMAIL, PASSWORD) VALUES ('{email}', '{password}');")
        for r in cursor.fetchall():
          print(r[0])

        cnx.close()
    except mysql.connector.Error as err:
      print("Something went wrong: {}".format(err))

      #   # res = cursor.execute(f"INSERT INTO USER (EMAIL, PASSWORD) VALUES ({email}, {password});")
    return {"email": email, "password": password, "form_data": data}

api.add_resource(Tables, '/api/db/tables')
api.add_resource(TestConnection, '/api/test')
api.add_resource(ManageUsers, '/api/user')

if __name__ == '__main__':
  app.run(debug=True, host=os.getenv("API_HOST"), port=os.getenv("API_PORT"))