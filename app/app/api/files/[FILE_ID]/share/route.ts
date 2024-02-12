import { CreateConnection } from "@/lib/db/DBUtil";
import { QueryGetFirst } from "@/lib/db/DBUtil";
import Logger from "@/lib/logger";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"

interface IOwnershipProps {
	USERNAME: string, 
	IS_OWNER: string, 
	NAME: string, 
	DESCRIPTION: string
}

export async function POST(request: NextRequest, context: {params: any}): Promise<NextResponse> {
	Logger.LogReq(request)
	const token = cookies().get('token')?.value;
	const { username } = await request.json() as {username: string}
	const { FILE_ID } = context.params;

	const AUTH_TO_ID_SQL = `SELECT USER_ID FROM AUTH WHERE TOKEN='${token}'`
	const SQL = `
		SELECT USERNAME, IS_OWNER, NAME, DESCRIPTION
		FROM FILE_INSTANCE
			INNER JOIN USER ON USER.ID=(${AUTH_TO_ID_SQL})
		WHERE USER_ID=(${AUTH_TO_ID_SQL}) AND FILE_ID='${FILE_ID}'
	`

	const {connection, err} = await CreateConnection()
	try {
    if(connection === null) {
      throw {message: err}
    }

		const fileInfoResp: IOwnershipProps = await QueryGetFirst(connection, SQL)
		if(fileInfoResp.USERNAME === username)
			throw {message: "cant share with yourself, idiot"}

		const isOwner = (fileInfoResp.IS_OWNER as any).readInt8() === 1
		if(isOwner) {
			const USER_SQL = `SELECT ID FROM USER WHERE USERNAME='${username}'`
			const SHARE_SQL = `
				INSERT INTO FILE_INSTANCE VALUES (
					(${USER_SQL}), '${FILE_ID}', NULL, 0, '${fileInfoResp.NAME}', '${fileInfoResp.DESCRIPTION}' 
				);
			`
			const shareResp: RowDataPacket[] = await connection.execute(SHARE_SQL) as RowDataPacket[]
			const affectedRows = shareResp[0].affectedRows;
			if(affectedRows > 0) {
				const UPDATED_SQL = `
					SELECT USERNAME
					FROM FILE_INSTANCE 
					INNER JOIN USER ON USER_ID=ID
					WHERE FILE_ID='${FILE_ID}' 
				`
				const sharedUsersResp = await connection.query(UPDATED_SQL)
				const sharedUsers = (sharedUsersResp[0] as any).map((user: any) => {
					return (user as any).USERNAME
				})
				
				return NextResponse.json({
					message: "Shared Success",
					sharedUsers: sharedUsers
				}, {
					status: 200
				})
			}
		}

	} catch (err: any) {
    Logger.LogErr(`Failed to share file | ${err.message}`)
	} finally {
		connection?.end()
	}

	return NextResponse.json({
		message: "Sharing Failed"
	}, {
		status: 500
	})
}

export async function DELETE(request: NextRequest, context: {params: any}): Promise<NextResponse> {
	Logger.LogReq(request)
	const token = cookies().get('token')?.value;
	const { username } = await request.json() as {username: string}
	const { FILE_ID } = context.params;

	const SQL = `
		SELECT IS_OWNER
		FROM FILE_INSTANCE 
		WHERE USER_ID=(SELECT USER_ID FROM AUTH WHERE TOKEN='${token}')
			AND FILE_ID='${FILE_ID}'
	`

	const {connection,err} = await CreateConnection()
	try {
    if(connection === null) {
      throw {message: err}
    }

		const resp = await QueryGetFirst(connection, SQL)
		const isOwner = resp.IS_OWNER.readInt8() === 1
		if(isOwner) {
			const USER_SQL = `SELECT ID FROM USER WHERE USERNAME='${username}'`
			const DEL_SQL = `
				DELETE FROM FILE_INSTANCE
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

	} catch (err: any) {
    Logger.LogErr("Failed to unshare file " + err.messaage)
	} finally {
		connection?.end()
	}

	return NextResponse.json({
		message: "Sharing Failed"
	}, {
		status: 500
	})
}