import { ResultSetHeader } from 'mysql2';
import { CreateConnection, QueryGetFirst } from './util';
import Logger from '../logger';

export interface IDBUser {
	ID: string,
	USERNAME: string,
	PASSWORD: string,
	CREATED_AT: Date
}

export default abstract class DBUser {
	static async GetByID(USER_ID: string): Promise<IDBUser | undefined> {
		let connection = await CreateConnection() 
		if(connection === null)
			return undefined

		const USER_SQL: string = `
			SELECT USER.*, SUM(SIZE_BYTES) AS USED_STORAGE_BYTES
			FROM FILE_OBJECT
				INNER JOIN FILE_INSTANCE ON FILE_ID=FILE.ID
				INNER JOIN USER ON USER_ID=USER.ID
			WHERE USER_ID='${USER_ID}';
		`
		try {
			const resp = await QueryGetFirst(connection, USER_SQL)
			return resp;
		} catch (err: any) {
      Logger.LogErr(err.message)
			return undefined;
		} finally {
			connection.end();
		}
	}

	static async GetByUsername(USERNAME: string): Promise<IDBUser | undefined> {
		let connection = await CreateConnection() 
		if(connection === null)
			return undefined

		const USER_SQL: string = `SELECT * FROM USER WHERE USERNAME='${USERNAME}';`

		try {
			const resp = await QueryGetFirst(connection, USER_SQL)
			return resp;
		} catch (err: any) {
      Logger.LogErr(err.message)
			return undefined;
		} finally {
			connection.end();
		}
	}

	static async Create(USERNAME: string, PASSWORD: string): Promise<IDBUser | undefined> {
		let connection = await CreateConnection() 
		if(connection === null)
			return undefined;
		
		try { 
			const INSERT_SQL: string = `INSERT INTO USER VALUES (DEFAULT, '${USERNAME}', '${PASSWORD}', DEFAULT)`
			const resp: ResultSetHeader[] = await connection.execute(INSERT_SQL) as ResultSetHeader[]

			const affectedRows: number = resp[0].affectedRows;
			if(affectedRows < 1) {
				return undefined;
			}

			return await DBUser.GetByUsername(USERNAME)
		} catch (err: any) {
      Logger.LogErr(err.message)
			return undefined; 
		} finally {
			connection.end()
		}
	}

	static async Validate(USERNAME: string, PASSWORD: string): Promise<IDBUser | undefined> {
		let connection = await CreateConnection() 
		if(connection === null)
			return undefined;
		
		try {
			const SQL: string = `SELECT * FROM USER WHERE USERNAME='${USERNAME}' AND PASSWORD='${PASSWORD}'`
			const USER: IDBUser = await QueryGetFirst(connection, SQL);
			return USER;
		} catch (err: any) {
      Logger.LogErr(err.message)
		} finally {
			connection.end()
		}
	}

	static async DeleteByID(USER_ID: string): Promise<boolean> {
		let connection = await CreateConnection() 
		if(connection === null)
			return false;

		try {
			const OWNER_SQL: string = `DELETE FROM FILE_INSTANCE WHERE USER_ID='${USER_ID}'`
			const USER_SQL: string = `DELETE FROM USER WHERE ID='${USER_ID}'`
			const COMMENT_SQL: string = `DELETE FROM COMMENT WHERE USER_ID='${USER_ID}'`
		
			const commentRes: number = await connection.execute(COMMENT_SQL).then(_ => 0).catch(e => e.errno)
			const ownerRes: number = await connection.execute(OWNER_SQL).then(_ => 0).catch(e => e.errno)
			const userRes: number = await connection.execute(USER_SQL).then(_ => 0).catch(e => e.errno)

			if(ownerRes !== 0 || userRes !== 0 || commentRes !== 0) {
				connection.end()
				return false;
			} 

			return true;
		} catch (err: any) {
      Logger.LogErr(err.message)
			return false;
		} finally {
			connection.end()
		}
	}
	
	static async CheckUsernameExists(USERNAME: string): Promise<boolean> {
		let connection = await CreateConnection()

		try {
			const SQL: string = `SELECT COUNT(*) AS COUNT FROM USER WHERE USERNAME='${USERNAME}'`
			const resp = await QueryGetFirst(connection, SQL) as { COUNT: number }
			return resp.COUNT > 0;
		} catch(err) {
			return false;
		} finally {
			connection.end()
		}
	}
}
