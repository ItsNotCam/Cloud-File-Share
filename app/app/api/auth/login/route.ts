import DBAuth from "@/lib/db/DBAuth";
import DBUser, { IDBUser } from "@/lib/db/DBUser";
import Logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  Logger.LogReq(request)

	const {username, password} = await request.json();
	const foundUser: IDBUser | undefined = await DBUser.Validate(username, password)

	if(foundUser === undefined) {
		Logger.LogMsg(`Failed to find user identified by ${username}`)
		return new Response("Failed", {status: 403})
	}

	const token = await DBAuth.GenerateToken(foundUser.ID);
	if(token === null) {
		Logger.LogErr(`Failed to generate token for user ${foundUser.ID}`)
		return NextResponse.json({ message: "failed to generate token" }, { status: 500 })
	}

	Logger.LogSuccess(`User ${foundUser.ID} \'${foundUser.USERNAME}\' logged in`)
	return NextResponse.json({ status: "authenticated", token: token }, { status: 200 })
}