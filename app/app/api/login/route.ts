import { DBUser } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import jwt from 'jsonwebtoken';
import { IUserProps } from "@/lib/types";

async function authenticate(username: string, password: string): Promise<IUserProps | undefined> {
	const dbuser: DBUser = new DBUser()
	await dbuser.Connect()
	return dbuser.Validate(username, password)
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {username, password} = await request.json()

	const user: IUserProps | undefined = await authenticate(username, password)
	if(user === undefined) {
		return NextResponse.json({ message: "authentication failed" }, { status: 400 })
	}
	
	const token = jwt.sign({ USER_ID: user.ID }, process.env.JWT_SECRET || "ok", {
    expiresIn: "1m",
  });
  
	return NextResponse.json({ 
		message: "authenticated", 
		token:  token
	}, { status: 200 })
}