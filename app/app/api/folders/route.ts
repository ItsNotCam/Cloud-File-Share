import DBFolder, { IFolderProps } from "@/lib/db/DBFolders"
import Logger from "@/lib/logger"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, response: NextResponse): Promise<NextResponse> {
	Logger.LogReq(request)
	const token = cookies().get("token")
	if(token === undefined) {
		return NextResponse.json({message: "not logged in"}, {status: 403})
	}

	const FOLDER_ID: string | null = request.nextUrl.searchParams.get("FOLDER_ID")
	if(FOLDER_ID !== null) {
		let folder = await DBFolder.GetFolderInfo({TOKEN: token.value}, FOLDER_ID)
		return NextResponse.json({
			folder: folder
		}, {
			status: 200
		})
	}

	let folders = await DBFolder.GetFoldersOfUser({TOKEN: token.value})
	return NextResponse.json({
		folders: folders
	}, {
		status: 200
	})
}

export async function POST(request: NextRequest, response: NextResponse): Promise<NextResponse> {
	Logger.LogReq(request)
	const token = cookies().get("token")
	if(token === undefined) {
		return NextResponse.json({message: "not logged in"}, {status: 403})
	}

	const folderProps: {
		PARENT_FOLDER_ID: string, 
		FOLDER_NAME: string, 
		COLOR: string 
	} = await request.json()

	const success = await DBFolder.CreateFolder(
		{ TOKEN: token.value }, 
		folderProps.PARENT_FOLDER_ID, 
		folderProps.FOLDER_NAME,
		folderProps.COLOR
	)

	return NextResponse.json({
		message: success ? "Success" : "Failed"
	}, {
		status: success ? 200 : 500
	})
}