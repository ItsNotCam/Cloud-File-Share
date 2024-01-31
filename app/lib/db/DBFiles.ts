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
	LAST_DOWNLOAD_USER_ID: Date,

	IS_OWNER: boolean
}

export default abstract class DBFile {
	static async GetFilesOfUserById(USER_ID: string): Promise<IDBFile[]> {
		const connection = await CreateConnection()
		if(connection === null)
			return []

		let SQL = `
			SELECT 
				F.ID, F.NAME, F.EXTENSION, F.FILENAME, F.DESCRIPTION, 
				F.SIZE_BYTES, F.UPLOAD_TIME, F.LAST_DOWNLOAD_TIME, F.LAST_DOWNLOAD_USER_ID,
				IS_OWNER
			FROM OWNERSHIP 
				INNER JOIN USER AS U ON U.ID = USER_ID 
				INNER JOIN FILE AS F ON F.ID = FILE_ID
			WHERE U.ID='${USER_ID}'
			ORDER BY F.FILENAME;
		`

		try {
			const resp = await connection.query(SQL)
			const files: IDBFile[] = resp[0] as IDBFile[]
			for(let i = 0; i < files.length; i++) {
				files[i].IS_OWNER = files[i].IS_OWNER.readInt8() // i have it as a bit in the database so i have to read the output here
			}

			// const owner = files[1].IS_OWNER
			// console.log(owner.readInt8())
			// if(owner.readInt8())
			// 	console.log("yep")

			// console.log(files[1].readUIntLE())
			// console.log(files[1])
			// console.log("VALUE: ", files[1].IS_OWNER)
			return files
		} catch (err) {
			return []
		} finally {
			connection.end()
		}
	}
}