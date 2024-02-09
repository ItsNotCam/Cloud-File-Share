import DBAuth from "@/lib/db/DBAuth";
import DBUser, { IDBUser } from "@/lib/db/DBUser";
import Logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  Logger.LogReq(request)
	const {username, password} = await request.json();
	const userExists: boolean = await DBUser.CheckUsernameExists(username)

	if(userExists) {
		return NextResponse.json({
			message: "Username already exists"
		}, {
			status: 400
		})
	}

	const newUser: IDBUser | undefined = await DBUser.Create(username, password)
	if(newUser === undefined) {
		return NextResponse.json({ status: "Failed to create user" }, { status: 500 })
	}

	const token = await DBAuth.GenerateToken(newUser.ID);
	if(token === null) {
		Logger.LogErr(`Failed to generate token for user ${newUser.ID}`)
		return NextResponse.json({ message: "failed to generate token" }, { status: 500 })
	}

	Logger.LogSuccess(`User ${newUser.ID} \'${newUser.USERNAME}\' registered`)
	return NextResponse.json({ token: token }, { status: 200 })
}