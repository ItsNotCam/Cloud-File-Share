import Logger from "../logger"
import { CreateConnection, QueryGetFirst } from "./DBUtil"

export interface IFolderProps {
	ID: string,
	NAME: string,
	COLOR: string,
	CHILDREN: IFolderProps[]
}

export default abstract class DBFolder {

	static async GetFolderInfo(
		identifier: { TOKEN?: string, USER_ID?: string },
		FOLDER_ID: string,
	): Promise<IFolderProps> {
		const ID_SQL = identifier.TOKEN !== undefined
			? `(SELECT USER_ID FROM AUTH WHERE TOKEN='${identifier.TOKEN}')`
			: `'${identifier.USER_ID}'`
		
		const SQL = `
			SELECT * FROM DIRECTORY
			WHERE ID='${FOLDER_ID}'
			AND USER_ID=${ID_SQL}
		`

		let { connection, err } = await CreateConnection()
		try {
			if (connection === null) {
				throw { message: `Failed to connect to database => ${err}` }
			}
			return await QueryGetFirst<IFolderProps>(connection, SQL)
		} catch (err: any) {
			Logger.LogErr(`Error moving folder folder | ${err.message}`)
		} finally {
			connection?.end()
		}

		return {} as IFolderProps;
	}

	static async UpdateFolder(
		identifier: { TOKEN?: string, USER_ID?: string },
		FOLDER_ID: string,
		FOLDER_NAME?: string,
		COLOR?: string,
		PARENT_ID?: string
	): Promise<boolean> {
		const ID_SQL = identifier.TOKEN !== undefined
			? `(SELECT USER_ID FROM AUTH WHERE TOKEN='${identifier.TOKEN}')`
			: `'${identifier.USER_ID}'`

		let updates: string[] = [] as string[]
		if(FOLDER_NAME) {
			updates.push(`NAME='${FOLDER_NAME}'`)
		}
		if(COLOR) {
			updates.push(`COLOR='${COLOR}'`)
		}
		if(PARENT_ID) {
			updates.push(`PARENT_ID='${PARENT_ID}'`)
		}
		
		let UPDATE_SQL = `
			UPDATE DIRECTORY
			SET ${updates.join(", ")} 
			WHERE ID='${FOLDER_ID}'
			AND OWNER_ID=${ID_SQL}
		`

		let { connection, err } = await CreateConnection()
		try {
			if (connection === null) {
				throw { message: `Failed to connect to database => ${err}` }
			}

			await connection.query(UPDATE_SQL)
			return true;
		} catch (err: any) {
			Logger.LogErr(`Error moving folder folder | ${err.message}`)
		} finally {
			connection?.end()
		}

		return false;
	}

	static async CreateFolder(
		identifier: { TOKEN?: string, USER_ID?: string },
		PARENT_FOLDER_ID: string,
		FOLDER_NAME: string,
		COLOR: string | undefined
	): Promise<boolean> {
		const ID_SQL = identifier.TOKEN !== undefined
			? `(SELECT USER_ID FROM AUTH WHERE TOKEN='${identifier.TOKEN}')`
			: `'${identifier.USER_ID}'`

		const FOLDER_SQL = `
				INSERT INTO DIRECTORY VALUES (
					DEFAULT, 
					'${PARENT_FOLDER_ID}',
					'${ID_SQL}',
					'${FOLDER_NAME}',
					${COLOR ? `'${COLOR}'` : "DEFAULT"}
				)
			`

		let { connection, err } = await CreateConnection()
		try {
			if (connection === null) {
				throw { message: `Failed to connect to database => ${err}` }
			}

			await connection.query(FOLDER_SQL)
			return true;
		} catch (err: any) {
			Logger.LogErr(`Error creating folder | ${err.message}`)
		} finally {
			connection?.end()
		}

		return false;
	}

	static async DeleteFolder(
		identifier: { TOKEN?: string, USER_ID?: string },
		FOLDER_ID: string
	): Promise<boolean> {
		const ID_SQL = identifier.TOKEN !== undefined
			? `(SELECT USER_ID FROM AUTH WHERE TOKEN='${identifier.TOKEN}')`
			: `'${identifier.USER_ID}'`

		const SQL = `
			DELETE FROM DIRECTORY
			WHERE ID='${FOLDER_ID}'
				AND OWNER_ID=${ID_SQL}
				AND (SELECT COUNT(*) FROM DIRECTORY WHERE PARENT_ID='${FOLDER_ID}') < 1
		`

		let { connection, err } = await CreateConnection()
		try {
			if (connection === null) {
				throw { message: `Failed to connect to database => ${err}` }
			}

			const [rows, _] = await connection.execute(SQL) as [{length: number}, any]
			return rows.length > 0;
		} catch(err: any) {
			Logger.LogErr(`Error deleting folder => ${err.message}`)
		} finally {
			connection?.end()
		}

		return false; 
	}

	static async GetFoldersOfUser(identifier: { TOKEN?: string, USER_ID?: string }): Promise<IFolderProps | undefined> {
		const ID_SQL = identifier.TOKEN !== undefined
			? `(SELECT USER_ID FROM AUTH WHERE TOKEN='${identifier.TOKEN}')`
			: `'${identifier.USER_ID}'`

		const RECURSE_SQL = `
			WITH RECURSIVE TREE (ID, NAME, PATH, PARENT_ID, COLOR, LEVEL) AS (
				SELECT DIR.ID, DIR.NAME, DIR.NAME, DIR.PARENT_ID, DIR.COLOR, 1 as LEVEL
				FROM DIRECTORY as DIR
				WHERE DIR.PARENT_ID IS NULL AND OWNER_ID=${ID_SQL}
				
				UNION
				
				SELECT D.ID, D.NAME, CONCAT(TREE.PATH, '/', D.NAME), D.PARENT_ID, D.COLOR, TREE.LEVEL+1
				FROM DIRECTORY D
				INNER JOIN TREE ON TREE.ID=D.PARENT_ID
			) 
			SELECT ID, NAME, COLOR, PATH FROM TREE;
		`

		let { connection, err } = await CreateConnection()
		try {
			if (connection === null) {
				throw { message: `Failed to connect to database => ${err}` }
			}

			const userResp = await connection.query(RECURSE_SQL)
			const entry = await userResp.entries().next()
			const allFolders = entry.value[1]

			// Translate database query results into JSON
			let foldersJSON: IFolderProps = {} as IFolderProps

			allFolders.forEach((row: any) => {
				const pathNames = row.PATH.split("/")
				let current = foldersJSON

				if (!current.CHILDREN)
					current.CHILDREN = [] as IFolderProps[]

				pathNames.forEach((pathName: string) => {
					let found = current.CHILDREN.find((child: IFolderProps) => child.NAME === pathName)
					if (!found) {
						found = { NAME: pathName, ID: "", COLOR: "", CHILDREN: [] }
						current.CHILDREN.push(found)
					}
					current = found
				})

				current.ID = row.ID
				current.COLOR = row.COLOR
			})

			return foldersJSON
		} catch (err: any) {
			Logger.LogErr(`Error getting folders => ${err.message}`)
		} finally {
			connection?.end()
		}

		return undefined
	}
}