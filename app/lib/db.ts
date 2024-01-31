import mysql from 'mysql2/promise'
import { IUserProps } from './types';

var { DB_HOST, DB_USER, DB_PASS, MYSQL_ROOT_DATABASE: DB_NAME } = process.env;

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

/*
export class DBUser {
	connection: mysql.Connection | null;

	constructor() { 
		this.connection = null;
	}
	
	async Connect(): Promise<boolean> {
		try { 
			this.connection = await CreateConnection(false) 
		} catch { 
			return false; 
		}

		return true;
	}
	
	async Disconnect(): Promise<boolean> {
		try { 
			this.connection?.end() 
		} catch { 
			return false; 
		}

		return true;
	}

	async GetByID(USER_ID: string): Promise<IUserProps | null> {
		if(this.connection === null)
			return null

		const USER_SQL: string = `
			SELECT USER.*, SUM(SIZE_BYTES) AS USED_STORAGE_BYTES
			FROM FILE
				INNER JOIN OWNERSHIP ON FILE_ID=FILE.ID
				INNER JOIN USER ON USER_ID=USER.ID
			WHERE USER_ID='${USER_ID}';
		`
		return await QueryGetFirst(this.connection, USER_SQL)
	}

	async GetByUsername(USERNAME: string): Promise<IUserProps | null> {
		if(this.connection === null)
			return null

		const USER_SQL: string = `
			SELECT USER.*, SUM(SIZE_BYTES) AS USED_STORAGE_BYTES
			FROM FILE
				INNER JOIN OWNERSHIP ON FILE_ID=FILE.ID
				INNER JOIN USER ON USER_ID=USER.ID
			WHERE USERNAME='${USERNAME}';
		`
		return await QueryGetFirst(this.connection, USER_SQL)
	}

	async Create(USERNAME: string, PASSWORD: string): Promise<boolean> {
		if(this.connection === null)
			return false;

		const SQL: string = `INSERT INTO USER VALUES (DEFAULT, '${USERNAME}', '${PASSWORD}', DEFAULT)`
	
		try { 
			await this.connection.execute(SQL) 
		} catch(err) { 
			return false; 
		}
		
		return true;
	}

	async Validate(USERNAME: string, PASSWORD: string): Promise<IUserProps | undefined> {
		if(this.connection === null)
			return undefined;

		const SQL: string = `SELECT * FROM USER WHERE USERNAME='${USERNAME}' AND PASSWORD='${PASSWORD}'`
		const USER: IUserProps = await QueryGetFirst(this.connection, SQL);
		
		return USER;
	}

	async DeleteByID(USER_ID: string): Promise<boolean> {
		if(this.connection === null)
			return false;

		const OWNER_SQL: string = `DELETE FROM OWNERSHIP WHERE USER_ID='${USER_ID}'`
		const USER_SQL: string = `DELETE FROM USER WHERE ID='${USER_ID}'`
		const COMMENT_SQL: string = `DELETE FROM COMMENT WHERE USER_ID='${USER_ID}'`
	
		const commentRes: number = await this.connection.execute(COMMENT_SQL).then(_ => 0).catch(e => e.errno)
		const ownerRes: number = await this.connection.execute(OWNER_SQL).then(_ => 0).catch(e => e.errno)
		const userRes: number = await this.connection.execute(USER_SQL).then(_ => 0).catch(e => e.errno)
	
		if(ownerRes !== 0 || userRes !== 0 || commentRes !== 0) {
			return false;
		} 
	
		return true;
	}
}
*/