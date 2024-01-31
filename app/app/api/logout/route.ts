import { NextRequest, NextResponse } from "next/server";

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