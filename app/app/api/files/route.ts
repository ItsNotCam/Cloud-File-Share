import DBFile from "@/lib/db/DBFiles"
import Logger from "@/lib/logger"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, response: NextResponse): Promise<NextResponse> {
	Logger.LogReq(request)
	const token = cookies().get("token")
	if(token === undefined) {
		return NextResponse.json({message: "not logged in"}, {status: 403})
	}

	let folderID = request.nextUrl.searchParams.get("folder")
	let files = await DBFile.GetFilesOfUser({TOKEN: token.value}, folderID)

	return NextResponse.json({
		files: files
	}, {
		status: 200
	})
}