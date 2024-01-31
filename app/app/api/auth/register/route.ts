import DBAuth from "@/lib/db/DBAuth";
import DBUser, { IDBUser } from "@/lib/db/DBUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
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
	console.log(token)
	return NextResponse.json({ token: token }, { status: 200 })
}