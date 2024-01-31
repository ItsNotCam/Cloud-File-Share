import { CreateConnection } from "@/lib/db";
import { QueryGetFirst } from "@/lib/db/util";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"

export async function POST(request: Request, context: {params: any}): Promise<NextResponse> {
	const token = cookies().get('token')?.value;
	const { username } = await request.json() as {username: string}
	const { FILE_ID } = context.params;

	const AUTH_TO_ID_SQL = `SELECT USER_ID FROM AUTH WHERE TOKEN='${token}'`
	const SQL = `
		SELECT USERNAME, IS_OWNER 
		FROM OWNERSHIP
			INNER JOIN USER ON USER.ID=(${AUTH_TO_ID_SQL})
		WHERE USER_ID=(${AUTH_TO_ID_SQL}) AND FILE_ID='${FILE_ID}'
	`

	const connection = await CreateConnection()
	try {
		const resp = await QueryGetFirst(connection, SQL)
		if(resp.USERNAME === username)
			throw "cant share with yourself, idiot"

		const isOwner = resp.IS_OWNER.readInt8() === 1
		if(isOwner) {
			const USER_SQL = `SELECT ID FROM USER WHERE USERNAME='${username}'`
			const SHARE_SQL = `
				INSERT INTO OWNERSHIP VALUES (
					(${USER_SQL}), '${FILE_ID}', '', NULL, DEFAULT 
				);
			`
			const resp: RowDataPacket[] = await connection.execute(SHARE_SQL) as RowDataPacket[]
			const affectedRows = resp[0].affectedRows;
			if(affectedRows > 0) {
				return NextResponse.json({
					message: "Shared Success"
				}, {
					status: 200
				})
			}
		}

	} catch (err) {
		console.log(err)
	} finally {
		connection.end()
	}

	return NextResponse.json({
		message: "Sharing Failed"
	}, {
		status: 500
	})
}

export async function DELETE(request: Request, context: {params: any}): Promise<NextResponse> {
	const token = cookies().get('token')?.value;
	const { username } = await request.json() as {username: string}
	const { FILE_ID } = context.params;

	const SQL = `
		SELECT IS_OWNER
		FROM OWNERSHIP 
		WHERE USER_ID=(SELECT USER_ID FROM AUTH WHERE TOKEN='${token}')
			AND FILE_ID='${FILE_ID}'
	`

	const connection = await CreateConnection()
	try {
		const resp = await QueryGetFirst(connection, SQL)
		const isOwner = resp.IS_OWNER.readInt8() === 1
		if(isOwner) {
			const USER_SQL = `SELECT ID FROM USER WHERE USERNAME='${username}'`
			const DEL_SQL = `
				DELETE FROM OWNERSHIP
				WHERE USER_ID=(${USER_SQL}) AND FILE_ID='${FILE_ID}'
			`

			const resp: RowDataPacket[] = await connection.execute(DEL_SQL) as RowDataPacket[]
			const affectedRows = resp[0].affectedRows;
			if(affectedRows > 0) {
				return NextResponse.json({
					message: "Shared Success"
				}, {
					status: 200
				})
			}
		}

	} catch (err) {
		console.log(err)
	} finally {
		connection.end()
	}

	return NextResponse.json({
		message: "Sharing Failed"
	}, {
		status: 500
	})
}