import moment from "moment";
import { IDBUser } from "./DBUser";
import { CreateConnection, QueryGetFirst } from "./util";
import { v4 } from 'uuid';
import Logger from "../logger";
import { cookies } from "next/headers";

export default abstract class DBAuth {
	static async GenerateToken(ID: string): Promise<string | null> {
		let {connection,err} = await CreateConnection() 
		try {
			if(connection === null) {
				throw {message: `Failed to connect to database => ${err}`}
			}
			const DELSQL: string = `DELETE FROM AUTH WHERE USER_ID='${ID}'`
			await connection.execute(DELSQL)

			const token: string = v4()
			const expireDate = moment(Date.now()).add(30, 'm').toDate();
			const expireSQL = `${expireDate.getFullYear()}-${expireDate.getMonth()+1}-${expireDate.getDate()} ${expireDate.getHours()}:${expireDate.getMinutes()}:${expireDate.getSeconds()}`

			const SQL: string = `INSERT INTO AUTH VALUES ('${ID}', '${token}', '${expireSQL}')`
			await connection.execute(SQL)		

			return token;
		} catch(err: any) {
			Logger.LogErr(`Error generating token | ${err.message}`)
		} finally {
			connection?.end()
		}

		return null
	}

	static async GetUserFromToken(token: string): Promise<IDBUser | undefined> {
		let {connection,err} = await CreateConnection() 
		try {
			if(connection === null) {
				throw {message: `Failed to connect to database => ${err}`}
			}
			const SQL: string = `SELECT * FROM USER WHERE ID=(SELECT USER_ID FROM AUTH WHERE TOKEN='${token}')`
			const user: IDBUser = await QueryGetFirst(connection, SQL);
			if(user !== undefined)
				return user;
		} catch(err: any) {
			Logger.LogErr(`Error getting user from token | ${err.message}`)
		} finally {
			connection?.end()
		}

		return undefined;
	}

	static async LogoutUser(token: string): Promise<boolean> {
		let {connection,err} = await CreateConnection() 
		try {
			if(connection === null) {
				throw {message: `Failed to connect to database => ${err}`}
			}
			const DELSQL: string = `DELETE FROM AUTH WHERE TOKEN='${token}'`
			await connection.execute(DELSQL)
			return true;
		} catch(err: any) {
			Logger.LogErr(`Error logging out user | ${err.message}`)
		} finally {
			connection?.end()
		}

		return false
	}

	static async Authenticate(): Promise<IDBUser | undefined> {
		const token = cookies().get("token");
		if (token === undefined)
			return undefined;
	
		const user: IDBUser | undefined = await DBAuth.GetUserFromToken(token.value);
		return user;
	}
}
