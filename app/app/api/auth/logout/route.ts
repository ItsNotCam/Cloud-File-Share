import DBAuth from "@/lib/db/DBAuth";
import { NextRequest, NextResponse } from "next/server";

import { cookies } from 'next/headers'
import Logger from "@/lib/logger";

export async function POST(request: NextRequest): Promise<Response> {
  Logger.LogReq(request)
	
	const token = cookies().get("token")
	if(token === undefined) {
		return NextResponse.json({ message: "unauthorized" }, { status: 403 })
	}
	
	const user = await DBAuth.GetUserFromToken(token.value)
	if(user === undefined) {
		return NextResponse.json({ message: "user does not exist" }, { status: 400 })
	}
	
	const loggedOut = await DBAuth.LogoutUser(token.value)
	if(!loggedOut) {
		Logger.LogErr(`Failed to logout user ${user.ID}`)
		return NextResponse.json({ message: "failed to logout" }, { status: 500 })
	}

	cookies().delete("token")
	Logger.LogSuccess(`User ${user.ID} \'${user.USERNAME}\' logged out`)
	return NextResponse.json({ message: "logged out" }, { status: 200 })
}