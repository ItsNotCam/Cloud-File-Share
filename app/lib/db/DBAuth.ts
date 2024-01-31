import moment from "moment";
import DBUser, { IDBUser } from "./DBUser";
import { CreateConnection, QueryGetFirst } from "./util";
import { v4 } from 'uuid';

export default abstract class DBAuth {
	static async GenerateToken(ID: string): Promise<string | null> {
		let connection = await CreateConnection()
		if(connection === null)
			return null

		const DELSQL: string = `DELETE FROM AUTH WHERE USER_ID='${ID}'`
		await connection.execute(DELSQL)

		const token: string = v4()
		const expireDate = moment(Date.now()).add(30, 'm').toDate();
		const expireSQL = `${expireDate.getFullYear()}-${expireDate.getMonth()+1}-${expireDate.getDate()} ${expireDate.getHours()}:${expireDate.getMinutes()}:${expireDate.getSeconds()}`
		console.log(expireSQL)

		const SQL: string = `INSERT INTO AUTH VALUES ('${ID}', '${token}', '${expireSQL}')`
		const resp = await connection.execute(SQL)		

		console.log(resp)

		return token;
	}

	static async GetUserFromToken(token: string): Promise<IDBUser | undefined> {
		let connection = await CreateConnection() 
		if(connection === null)
			return undefined

		const SQL: string = `SELECT * FROM USER WHERE ID=(SELECT USER_ID FROM AUTH WHERE TOKEN='${token}')`
		const user: IDBUser = await QueryGetFirst(connection, SQL);
		
		if(user === undefined)
			return undefined;

		return user;
	}

	static async LogoutUser(token: string): Promise<boolean> {
		let connection = await CreateConnection() 
		if(connection === null)
			return false

		const DELSQL: string = `DELETE FROM AUTH WHERE TOKEN='${token}'`
		const success: boolean = await connection.execute(DELSQL)
			.then(_ => true)
			.catch(_ => false)

		return success;
	}
}