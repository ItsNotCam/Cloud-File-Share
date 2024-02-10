import DBFiles from "@/lib/db/DBFiles"
import Logger from "@/lib/logger"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, response: NextResponse): Promise<NextResponse> {
	Logger.LogReq(request)
	const token = cookies().get("token")
	if(token === undefined) {
		return NextResponse.json({message: "not logged in"}, {status: 403})
	}

	// const { folderID } = await request.json() as {  folderID?: string }
	let files = await DBFiles.GetFilesOfUser({TOKEN: token.value})
	let folders = await DBFiles.GetFoldersOfUser({TOKEN: token.value})

	return NextResponse.json({
		files: files,
		folders: folders
	}, {
		status: 200
	})
}