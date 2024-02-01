import { QueryGetFirst } from "../db"
import DBAuth from "./DBAuth"
import { IDBUser } from "./DBUser"
import { CreateConnection } from "./util"

export interface IDBFile {
	ID: string,
	NAME: string,
	EXTENSION: string,
	FILENAME: string,
	DESCRIPTION: string,
	SIZE_BYTES: number,
	UPLOAD_TIME: Date,
	LAST_DOWNLOAD_TIME: Date,
	LAST_DOWNLOAD_USER_ID: string,

	IS_OWNER: boolean
}

export default abstract class DBFile {
	static async GetFileInfo(FILE_ID: string, userID: {token?: string, id?: string}) {
		const connection = await CreateConnection()
		if(connection === null)
			return []

		const {token, id} = userID;
		let SQL = ""

		if(token !== undefined) {
			SQL = `
				SELECT 
					F.ID, F.NAME, F.EXTENSION, F.FILENAME, OWNERSHIP.DESCRIPTION, 
					F.SIZE_BYTES, F.UPLOAD_TIME, F.LAST_DOWNLOAD_TIME, F.LAST_DOWNLOAD_USER_ID,
					IS_OWNER
				FROM OWNERSHIP 
					INNER JOIN USER AS U ON U.ID = USER_ID 
					INNER JOIN FILE AS F ON F.ID = FILE_ID	
					INNER JOIN AUTH ON AUTH.USER_ID=U.ID
				WHERE AUTH.TOKEN='${token}' AND F.ID='${FILE_ID}'
				ORDER BY F.FILENAME;
			`
		} else {
			SQL = `
				SELECT 
					F.ID, F.NAME, F.EXTENSION, F.FILENAME, OWNERSHIP.DESCRIPTION, 
					F.SIZE_BYTES, F.UPLOAD_TIME, F.LAST_DOWNLOAD_TIME, F.LAST_DOWNLOAD_USER_ID,
					IS_OWNER
				FROM OWNERSHIP 
					INNER JOIN USER AS U ON U.ID = USER_ID 
					INNER JOIN FILE AS F ON F.ID = FILE_ID	
				WHERE U.ID='${id}' AND F.ID='${FILE_ID}';
			`
		}

		try {
			return await QueryGetFirst(connection, SQL) as IDBFile;
		} catch (err) {
			console.log(err)
		} finally {
			connection.end()
		}
	}

	static async GetFilesOfUser(identifier: {USER_ID?: string, TOKEN?: string}): Promise<IDBFile[]> {
		const connection = await CreateConnection()
		if(connection === null)
			return []

		const {USER_ID, TOKEN}  = identifier

		let SQL: string = ""
		if(USER_ID !== undefined) {
			SQL = `
				SELECT 
					F.ID, F.NAME, F.EXTENSION, F.FILENAME, OWNERSHIP.DESCRIPTION, 
					F.SIZE_BYTES, F.UPLOAD_TIME, F.LAST_DOWNLOAD_TIME, F.LAST_DOWNLOAD_USER_ID,
					IS_OWNER
				FROM OWNERSHIP 
					INNER JOIN USER AS U ON U.ID = USER_ID 
					INNER JOIN FILE AS F ON F.ID = FILE_ID
				WHERE U.ID='${USER_ID}'
				ORDER BY F.UPLOAD_TIME DESC;
			` 
		} else if(TOKEN !== undefined) {
			SQL = `
				SELECT 
					F.ID, F.NAME, F.EXTENSION, F.FILENAME, OWNERSHIP.DESCRIPTION, 
					F.SIZE_BYTES, F.UPLOAD_TIME, F.LAST_DOWNLOAD_TIME, F.LAST_DOWNLOAD_USER_ID,
					IS_OWNER
				FROM OWNERSHIP 
					INNER JOIN USER AS U ON U.ID = USER_ID 
					INNER JOIN FILE AS F ON F.ID = FILE_ID	
					INNER JOIN AUTH ON AUTH.USER_ID=U.ID
				WHERE AUTH.TOKEN='${TOKEN}'
				ORDER BY F.FILENAME;
			`
		}

		try {
			const resp = await connection.query(SQL)
			const files: IDBFile[] = resp[0] as IDBFile[]
			for(let i = 0; i < files.length; i++) {
				files[i].IS_OWNER = files[i].IS_OWNER.readInt8() // i have it as a bit in the database so i have to read the output here
			}

			return files
		} catch (err) {
			console.log(err)
		} finally {
			connection.end()
		}
		
		return []
	}
}