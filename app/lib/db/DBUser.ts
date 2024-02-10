import { ResultSetHeader } from 'mysql2';
import { CreateConnection, QueryGetFirst } from './DBUtil';
import Logger from '../logger';

export interface IDBUser {
	ID: string,
	USERNAME: string,
	PASSWORD: string,
	CREATED_AT: Date
}

export default abstract class DBUser {
	static async GetByID(USER_ID: string): Promise<IDBUser | undefined> {
		const USER_SQL: string = `
			SELECT USER.*, SUM(SIZE_BYTES) AS USED_STORAGE_BYTES
			FROM FILE_OBJECT
				INNER JOIN FILE_INSTANCE ON FILE_ID=FILE.ID
				INNER JOIN USER ON USER_ID=USER.ID
			WHERE USER_ID='${USER_ID}';
		`
		
		let {connection,err} = await CreateConnection() 
		try {
			if(connection === null) {
				throw {message: `Failed to connect to database => ${err}`}
			}
			const resp = await QueryGetFirst(connection, USER_SQL)
			return resp;
		} catch (err: any) {
			Logger.LogErr(`Error getting user by id ${USER_ID} | ${err.message}`)
		} finally {
			connection?.end();
		}
		return undefined;
	}

	static async GetByUsername(USERNAME: string): Promise<IDBUser | undefined> {
		const USER_SQL: string = `SELECT * FROM USER WHERE USERNAME='${USERNAME}';`

		let {connection,err} = await CreateConnection() 
		try {
			if(connection === null) {
				throw {message: `Failed to connect to database => ${err}`}
			}
			return await QueryGetFirst(connection, USER_SQL)
		} catch (err: any) {
			Logger.LogErr(`Error getting user by username \'${USERNAME}\' | ${err.message}`)
		} finally {
			connection?.end();
		}

		return undefined;
	}

	static async Create(USERNAME: string, PASSWORD: string): Promise<IDBUser | undefined> {
		let {connection,err} = await CreateConnection() 
		try {
			if(connection === null) {
				throw {message: `Failed to connect to database => ${err}`}
			}
			const INSERT_SQL: string = `INSERT INTO USER VALUES (DEFAULT, '${USERNAME}', '${PASSWORD}', DEFAULT)`
			const userResp: ResultSetHeader[] = await connection.execute(INSERT_SQL) as ResultSetHeader[]
			
			let affectedRows: number = userResp[0].affectedRows;
			if(affectedRows < 1) {
				throw {message: "No rows were updated"};
			}

			const user = await DBUser.GetByUsername(USERNAME)
			if(user === undefined) {
				throw {message: `Failed to get user by username ${USERNAME}`}
			}

			const FOLDER_SQL: string = `INSERT INTO DIRECTORY VALUES (
				DEFAULT, NULL, '${user?.ID}', 'Home', DEFAULT
			)`
			const folderResp: ResultSetHeader[] = await connection.execute(FOLDER_SQL) as ResultSetHeader[]
			affectedRows = folderResp[0].affectedRows;
			if(affectedRows < 1) {
				throw {message: 'Failed to create user root folder'}
			}

			return user
		} catch (err: any) {
			Logger.LogErr(`Error creating user | ${err.message}`)
		} finally {
			await connection?.end()
		}
		return undefined; 
	}

	static async Validate(USERNAME: string, PASSWORD: string): Promise<IDBUser | undefined> {
		let {connection,err} = await CreateConnection() 
		try {
			if(connection === null) {
				throw {message: `Failed to connect to database => ${err}`}
			}
			const SQL: string = `SELECT * FROM USER WHERE USERNAME='${USERNAME}' AND PASSWORD='${PASSWORD}'`
			const USER: IDBUser = await QueryGetFirst(connection, SQL);
			return USER;
		} catch (err: any) {
			Logger.LogErr(`Error validating user | ${err.message}`)
		} finally {
			await connection?.end()
		}
	}

	static async DeleteByID(USER_ID: string): Promise<boolean> {
		let {connection,err} = await CreateConnection() 
		try {
			if(connection === null) {
				throw {message: `Failed to connect to database => ${err}`}
			}
			const OWNER_SQL: string = `DELETE FROM FILE_INSTANCE WHERE USER_ID='${USER_ID}'`
			const USER_SQL: string = `DELETE FROM USER WHERE ID='${USER_ID}'`
			const COMMENT_SQL: string = `DELETE FROM COMMENT WHERE USER_ID='${USER_ID}'`
		
			await connection.execute(COMMENT_SQL)
			await connection.execute(OWNER_SQL)
			await connection.execute(USER_SQL)

			return true;
		} catch (err: any) {
			Logger.LogErr(`Error deleting user | ${err.message}`)
		} finally {
			connection?.end()
		}
		return false;
	}
	
	static async CheckUsernameExists(USERNAME: string): Promise<boolean> {
		let {connection,err} = await CreateConnection() 
		try {
			if(connection === null) {
				throw {message: `Failed to connect to database => ${err}`}
			}
			const SQL: string = `SELECT COUNT(*) AS COUNT FROM USER WHERE USERNAME='${USERNAME}'`
			const resp = await QueryGetFirst(connection, SQL) as { COUNT: number }
			return resp.COUNT > 0;
		} catch(err: any) {
			Logger.LogErr(`Error checking if username exists | ${err.message}`)
		} finally {
			await connection?.end()
		}
		return false;
	}
}
