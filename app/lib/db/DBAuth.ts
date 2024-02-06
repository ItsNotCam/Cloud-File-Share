import moment from "moment";
import { IDBUser } from "./DBUser";
import { CreateConnection, QueryGetFirst } from "./util";
import { v4 } from 'uuid';
import Logger from "../logger";

export default abstract class DBAuth {
	static async GenerateToken(ID: string): Promise<string | null> {
		let connection = await CreateConnection() 
		if(connection === null) {
			Logger.LogErr("Failed to connect to database")
			return null
		}

		try {
			const DELSQL: string = `DELETE FROM AUTH WHERE USER_ID='${ID}'`
			await connection.execute(DELSQL)

			const token: string = v4()
			const expireDate = moment(Date.now()).add(30, 'm').toDate();
			const expireSQL = `${expireDate.getFullYear()}-${expireDate.getMonth()+1}-${expireDate.getDate()} ${expireDate.getHours()}:${expireDate.getMinutes()}:${expireDate.getSeconds()}`

			const SQL: string = `INSERT INTO AUTH VALUES ('${ID}', '${token}', '${expireSQL}')`
			await connection.execute(SQL)		

			return token;
		} catch(err: any) {
			Logger.LogErr(err.message)
		}

		return null
	}

	static async GetUserFromToken(token: string): Promise<IDBUser | undefined> {
		let connection = await CreateConnection() 
		if(connection === null) {
			Logger.LogErr("Failed to connect to database")
			return undefined		
		}

		try {
			const SQL: string = `SELECT * FROM USER WHERE ID=(SELECT USER_ID FROM AUTH WHERE TOKEN='${token}')`
			const user: IDBUser = await QueryGetFirst(connection, SQL);
			if(user !== undefined)
				return user;
		} catch(err: any) {
			Logger.LogErr(err.message)
		}
		return undefined;
	}

	static async LogoutUser(token: string): Promise<boolean> {
		let connection = await CreateConnection() 
		if(connection === null) {
			Logger.LogErr("Failed to connect to database")
			return false		
		}

		const DELSQL: string = `DELETE FROM AUTH WHERE TOKEN='${token}'`
		try {
			await connection.execute(DELSQL)
			return true;
		} catch(err: any) {
			Logger.LogErr(err.message)
		}

		return false
	}
}