import mysql from 'mysql2/promise'
import { IDBUser } from './DBUser';
import DBAuth from './DBAuth';
import { cookies } from 'next/headers';

const { DB_HOST, DB_USER, DB_PASS, MYSQL_ROOT_DATABASE: DB_NAME } = process.env;

export async function CreateConnection(multipleStatements?: boolean): Promise<mysql.Connection> {
  return await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    multipleStatements: multipleStatements !== undefined && multipleStatements
  })
}

export async function QueryGetFirst(connection: mysql.Connection, SQL: string): Promise<any> {
  return await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]);
}

export async function authenticate(): Promise<IDBUser | undefined> {
	const token = cookies().get("token")
	if(token === undefined)
		return undefined
		
	const user: IDBUser | undefined = await DBAuth.GetUserFromToken(token.value)
	return user;
}