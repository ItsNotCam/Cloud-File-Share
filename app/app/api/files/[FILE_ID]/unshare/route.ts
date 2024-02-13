import DBAuth from "@/lib/db/DBAuth";
import DBFile from "@/lib/db/DBFiles";
import Logger from "@/lib/logger";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, context: {params: any}): Promise<NextResponse> {
	Logger.LogReq(request)
	const userToken = cookies().get('token')?.value;
	const { FILE_ID } = context.params;
	
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
}