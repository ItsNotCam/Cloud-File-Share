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
	static async GetFileInfo(FILE_ID: string, identifier: {TOKEN?: string, USER_ID?: string}) {
		const connection = await CreateConnection()
		if(connection === null)
			return []

		const {TOKEN, USER_ID} = identifier;
		let SQL = ""

		if(TOKEN !== undefined) {
			SQL = `
				SELECT 
					FO.ID, FI.NAME, FO.EXTENSION, CONCAT(FI.NAME, FO.EXTENSION) AS FILENAME, FI.DESCRIPTION, 
					FO.SIZE_BYTES, FO.UPLOAD_TIME, FO.LAST_DOWNLOAD_TIME, FO.LAST_DOWNLOAD_USER_ID,
					FI.IS_OWNER
				FROM FILE_INSTANCE AS FI
					INNER JOIN USER AS U ON U.ID = USER_ID 
					INNER JOIN FILE_OBJECT AS FO ON FO.ID = FILE_ID	
					INNER JOIN AUTH ON AUTH.USER_ID=U.ID
				WHERE AUTH.TOKEN='${TOKEN}' AND FO.ID='${FILE_ID}';
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
				WHERE U.ID='${USER_ID}' AND FO.ID='${FILE_ID}';
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

  static async UserIsOwner(FILE_ID: string, identifier: { USER_ID?: string, TOKEN?: string }): Promise<boolean> {
    const {USER_ID, TOKEN} = identifier

    if(!USER_ID && !TOKEN) {
      return false;
    }

    const connection = await CreateConnection()
    let SQL = `
      SELECT COUNT(*) AS COUNT
      FROM FILE_INSTANCE
      WHERE FILE_ID='${FILE_ID}' AND IS_OWNER=1 AND USER_ID=
    `
    if(USER_ID) {
      SQL += `'${USER_ID}'`
    } else {
      SQL += `(SELECT USER_ID FROM AUTH WHERE TOKEN='${TOKEN}' LIMIT 1)`
    }

    const resp = await QueryGetFirst(connection, SQL)
    return resp.COUNT > 0;
  }

  static async UpdateFileInfo(
    FILE_ID: string,
    identifier: { TOKEN?: string, USER_ID?: string }, 
    info: { DESCRIPTION?: string, NAME?: string }): Promise<boolean> 
  {
    const {TOKEN, USER_ID} = identifier
    const {DESCRIPTION, NAME} = info

    if(!TOKEN && !USER_ID) {
      return false;
    }

    if(!DESCRIPTION && !NAME) {
      return false;
    }

    /*
      GENERATE SQL QUERY
    
      All of this will end up with something like:
      
      UPDATE FILE_INSTANCE
      SET DESCRIPTION='...', NAME='...'
      WHERE FILE_ID='...' AND USER_ID=(SELECT USER_ID FROM AUTH WHERE TOKEN='...')
    */
    let SQL = `UPDATE FILE_INSTANCE SET`
    {
      let updatedFields: string[] = []
      if(DESCRIPTION) {
        updatedFields.push(`DESCRIPTION='${DESCRIPTION}'`)
      }
      if(NAME) {
        updatedFields.push(`NAME='${NAME}'`)
      }

      SQL += ` ${updatedFields.join(",")} 
        WHERE FILE_ID='${FILE_ID}' 
        AND USER_ID=`

      if(USER_ID) {
        SQL += `'${USER_ID}'`
      } else {
        SQL += `(SELECT USER_ID FROM AUTH WHERE TOKEN='${TOKEN}')`
      }
    }

    console.log(`UPDATING FILE:\n${SQL}`)
    try {
      const connection = await CreateConnection()
      await connection.execute(SQL)
      return true;
    } catch (err: any) {
      console.log(`UPDATING FILE FAILED:\n${err.message}`)
    }
    return false;
  }

  static async DeleteFile(FILE_ID: string, identifier: { USER_ID?: string, TOKEN?: string }): Promise<string | undefined> {
    const connection = await CreateConnection()
    const {USER_ID, TOKEN} = identifier
    try {
      // get the file path of the saved file
      const validateUser = await DBFile.UserIsOwner(FILE_ID,{
        USER_ID: USER_ID,
        TOKEN: TOKEN
      })

      if(!validateUser)
        throw "unauthorized"

      const SQL: string = `
        SELECT INTERNAL_FILE_PATH 
        FROM FILE_OBJECT 
        WHERE ID='${FILE_ID}'
      `
      const PATH: string = (await QueryGetFirst(connection, SQL)).INTERNAL_FILE_PATH
  
      // remove from tables
      let OWN_SQL: string = `DELETE FROM FILE_INSTANCE WHERE FILE_ID='${FILE_ID}'`
      await connection.execute(OWN_SQL)
      let COMM_SQL: string = `DELETE FROM COMMENT WHERE FILE_ID='${FILE_ID}'`
      await connection.execute(COMM_SQL)
      let FILE_SQL: string = `DELETE FROM FILE_OBJECT WHERE ID='${FILE_ID}'`
      await connection.execute(FILE_SQL)
      return PATH;
    } catch(err: any) {
      console.log("ERROR DELETING FILE: " + err.message)
    } finally {
      connection.end()
    }

    return undefined;
  }
}