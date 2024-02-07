import { CreateConnection, QueryGetFirst } from "@/lib/db/util";
import Logger from "@/lib/logger";
import { RowDataPacket } from "mysql2/promise";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, context: {params: any}): Promise<NextResponse> {
	Logger.LogReq(request)
	const token = cookies().get('token')?.value;
	const { FILE_ID } = context.params;
	
	const {connection, err} = await CreateConnection()
	try {
    if(connection === null)
      throw {messaage: err}

		const USER_SQL = `SELECT USER_ID FROM AUTH WHERE TOKEN='${token}'`
		const userResp = await QueryGetFirst(connection, USER_SQL)
		if(userResp.USER_ID === undefined) {
			throw "nope"
		}

		const DEL_SQL = `
			DELETE FROM FILE_INSTANCE WHERE USER_ID='${userResp.USER_ID}' AND FILE_ID='${FILE_ID}'
		`
		const resp: RowDataPacket[] = await connection.execute(DEL_SQL) as RowDataPacket[]
		const affectedRows = resp[0].affectedRows;
		if(affectedRows > 0) {
			return NextResponse.json({
				message: "Unsharing Successful"
			}, {
				status: 200
			})
		}

	} catch (err: any) {
    Logger.LogErr(err.message)
	} finally {
		connection?.end()
	}

	return NextResponse.json({
		message: "Sharing Failed"
	}, {
		status: 500
	})
}