import mysql from 'mysql2/promise'
import Logger from './logger';

var { DB_HOST, DB_USER, DB_PASS, MYSQL_ROOT_DATABASE: DB_NAME } = process.env;

export async function CreateConnection(multipleStatements?: boolean): Promise<mysql.Connection | null> {
	try {
		const connection = await mysql.createConnection({
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASS,
			database: DB_NAME,
			multipleStatements: multipleStatements !== undefined && multipleStatements
		})
		return connection
	} catch(err: any) {
		Logger.LogErr(`Failed to connect to database: | ${err.message}`)
		return null
	}
}

export async function QueryGetFirst(connection: mysql.Connection, SQL: string): Promise<any> {
  return await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]);
}