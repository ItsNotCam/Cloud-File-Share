import mysql from 'mysql2/promise'
import Logger from '../logger';

const { DB_HOST, DB_USER, DB_PASS, MYSQL_ROOT_DATABASE: DB_NAME } = process.env;

export function IDtoSQL(identifier: { TOKEN?: string, USER_ID?: string }): string {
  if(identifier.TOKEN) {
    return `(SELECT USER_ID FROM AUTH WHERE TOKEN='${identifier.TOKEN}')`
  }

  if(identifier.USER_ID) {
    return `'${identifier.USER_ID}'`
  }

  return ""
}

export async function CreateConnection(multipleStatements?: boolean): Promise<{connection: mysql.Connection | null, err: string | undefined}> {
	try {
		const connection = await mysql.createConnection({
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASS,
			database: DB_NAME,
			multipleStatements: multipleStatements !== undefined && multipleStatements
		})
		return {connection: connection, err: undefined}
	} catch(err: any) {
		return {
			connection: null,
			err: err.message
		}
	}
}

export async function QueryGetFirst<T>(connection: mysql.Connection, SQL: string): Promise<any> {
  return await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0] as T)
		.catch(err => Logger.LogErr(`Error querying database ${err.message}`))
}

