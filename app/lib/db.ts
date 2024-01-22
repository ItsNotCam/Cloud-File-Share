import mysql from 'mysql2/promise'

var { DB_HOST, DB_USER, DB_PASS, MYSQL_ROOT_DATABASE: DB_NAME } = process.env;

export async function CreateConnection(multipleStatements: boolean = false): Promise<mysql.Connection> {
	return await mysql.createConnection({
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASS,
		database: DB_NAME,
		multipleStatements: multipleStatements
	})
}

type UserProps = {
	ID: string,
	USERNAME: string,
	EMAIL: string,
	PASSWORD: string,
	CREATED: Date,
	LAST_LOGGED_IN: Date
}

type ok = {
	where: UserProps[]
}

// class user {
//     selectMany = (ok): void => {
//         const SQL: string = "SELECT * FROM USER WHERE"
//         ok.map(k => SQL.concat(""))
//     }
// }

class db {

}