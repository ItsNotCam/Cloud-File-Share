import { QueryGetFirst } from "../db"
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
					FO.ID, FI.NAME, FO.EXTENSION, CONCAT(FI.NAME, FO.EXTENSION) AS FILENAME, FI.DESCRIPTION, 
					FO.SIZE_BYTES, FO.UPLOAD_TIME, FO.LAST_DOWNLOAD_TIME, FO.LAST_DOWNLOAD_USER_ID,
					FI.IS_OWNER
				FROM FILE_INSTANCE AS FI
					INNER JOIN USER AS U ON U.ID = USER_ID 
					INNER JOIN FILE_OBJECT AS FO ON FO.ID = FILE_ID	
					INNER JOIN AUTH ON AUTH.USER_ID=U.ID
				WHERE AUTH.TOKEN='${token}' AND FO.ID='${FILE_ID}';
			`
		} else {
			SQL = `
				SELECT 
					FO.ID, FI.NAME, FO.EXTENSION, CONCAT(FI.NAME, FO.EXTENSION) AS FILENAME, FI.DESCRIPTION, 
					FO.SIZE_BYTES, FO.UPLOAD_TIME, FO.LAST_DOWNLOAD_TIME, FO.LAST_DOWNLOAD_USER_ID,
					FI.IS_OWNER
				FROM FILE_INSTANCE AS FI
					INNER JOIN USER AS U ON U.ID = USER_ID 
					INNER JOIN FILE_OBJECT AS FO ON FO.ID = FILE_ID	
					INNER JOIN AUTH ON AUTH.USER_ID=U.ID
				WHERE U.ID='${userID}' AND FO.ID='${FILE_ID}';
			`
		}

		try {
      let file = await QueryGetFirst(connection, SQL) as IDBFile;
      file.IS_OWNER = (file.IS_OWNER as any).readInt8() // i have it as a bit in the database so i have to read the output here
      return file
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
					FO.ID, FI.NAME, FO.EXTENSION, CONCAT(FI.NAME, FO.EXTENSION), FI.DESCRIPTION, 
					FO.SIZE_BYTES, FO.UPLOAD_TIME, FO.LAST_DOWNLOAD_TIME, FO.LAST_DOWNLOAD_USER_ID,
					FI.IS_OWNER
				FROM FILE_INSTANCE AS FI
					INNER JOIN USER AS U ON U.ID = USER_ID 
					INNER JOIN FILE_OBJECT AS FO ON FO.ID = FILE_ID	
				WHERE U.ID='${USER_ID}'
				ORDER BY FO.UPLOAD_TIME DESC;
			` 
		} else if(TOKEN !== undefined) {
			SQL = `
				SELECT 
					FO.ID, FI.NAME, FO.EXTENSION, CONCAT(FI.NAME, FO.EXTENSION), FI.DESCRIPTION, 
					FO.SIZE_BYTES, FO.UPLOAD_TIME, FO.LAST_DOWNLOAD_TIME, FO.LAST_DOWNLOAD_USER_ID,
					FI.IS_OWNER
				FROM FILE_INSTANCE AS FI
					INNER JOIN USER AS U ON U.ID = USER_ID 
					INNER JOIN FILE_OBJECT AS FO ON FO.ID = FILE_ID	
					INNER JOIN AUTH ON AUTH.USER_ID=U.ID
				WHERE AUTH.TOKEN='${TOKEN}'
				ORDER BY FO.UPLOAD_TIME DESC;
			`
		}

		try {
			const resp = await connection.query(SQL)
			const files: IDBFile[] = resp[0] as IDBFile[]
			for(let i = 0; i < files.length; i++) {
				files[i].IS_OWNER = (files[i].IS_OWNER as any).readInt8() // i have it as a bit in the database so i have to read the output here
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