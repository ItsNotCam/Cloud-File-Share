import DBAuth from "@/lib/db/DBAuth";
import DBFile from "@/lib/db/DBFiles";
import { CreateConnection, QueryGetFirst } from "@/lib/db/DBUtil";
import Logger from "@/lib/logger";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, context: {params: any}): Promise<NextResponse> {
	Logger.LogReq(request)
	const userToken = cookies().get('token')?.value;
	const { FILE_ID } = context.params;
	
	const {connection, err} = await CreateConnection()
	try {
    if(connection === null)
      throw {messaage: err}

		let { username, self } = await request.json() as { username?: string, self?: boolean }

		if(self) {
			const user = await DBAuth.GetUserFromToken(userToken || "")
			username = user?.USERNAME
		}
		
		const sharedUsers = await DBFile.Unshare(FILE_ID, {TOKEN: userToken}, username)
		if(sharedUsers === undefined) {
			throw {message: `Failed to unshare file '${FILE_ID}' with ${username}`}
		}

		return NextResponse.json({
			message: "Unshared Success",
			sharedUsers: sharedUsers
		}, {
			status: 200
		})
	} catch (err: any) {
    Logger.LogErr(err.message)
	} finally {
		connection?.end()
	}

	return NextResponse.json({
		message: "Unsharing Failed"
	}, {
		status: 500
	})
}