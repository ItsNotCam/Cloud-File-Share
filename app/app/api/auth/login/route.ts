import DBAuth from "@/lib/db/DBAuth";
import DBFiles from "@/lib/db/DBFiles";
import DBUser, { IDBUser } from "@/lib/db/DBUser";
import Logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  Logger.LogMsg(request.url)

	const {username, password} = await request.json();

	const foundUser: IDBUser | undefined = await DBUser.Validate(username, password)

	if(foundUser === undefined) {
		return new Response("Failed", {status: 403})
	}

	const token = await DBAuth.GenerateToken(foundUser.ID);

	return NextResponse.json({ status: "authenticated", token: token }, { status: 200 })
}