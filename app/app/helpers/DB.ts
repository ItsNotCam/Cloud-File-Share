import mysql from 'mysql2/promise'

var { DB_HOST, DB_USER, DB_PASS, MYSQL_ROOT_DATABASE: DB_NAME } = process.env;

export async function CreateConnection(): Promise<mysql.Connection> {
    return await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME
    })
}