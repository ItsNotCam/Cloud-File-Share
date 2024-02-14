import DBFolder, { IFolderProps } from "@/lib/db/DBFolders"
import Logger from "@/lib/logger"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, context: {params: {FOLDER_ID: string}}): Promise<NextResponse> {
	Logger.LogReq(request)
	const { FOLDER_ID } = context.params
	const token = cookies().get("token")
	if(token === undefined) {
		return NextResponse.json({message: "not logged in"}, {status: 403})
	}

	let folder = await DBFolder.GetFolderInfo({TOKEN: token.value}, FOLDER_ID)
	return NextResponse.json({
		folder: folder
	}, {
		status: 200
	})
}

export async function DELETE(request: NextRequest, context: {params: {FOLDER_ID: string}}): Promise<NextResponse> {
	Logger.LogReq(request)
	const { FOLDER_ID } = context.params
	const token = cookies().get("token")
	if(token === undefined) {
		return NextResponse.json({message: "not logged in"}, {status: 403})
	}

	const success = await DBFolder.DeleteFolder(
		{ TOKEN: token.value },
		FOLDER_ID
	)

	return NextResponse.json({
		message: success ? "Success" : "Failed"
	}, {
		status: success ? 200 : 500
	})
}

export async function PUT(request: NextRequest, context: {params: {FOLDER_ID: string}}): Promise<NextResponse> {
	Logger.LogReq(request)
	const { FOLDER_ID } = context.params
	const token = cookies().get("token")
	if(token === undefined) {
		return NextResponse.json({message: "not logged in"}, {status: 403})
	}

	const folderProps: {
		NAME?: string, 
		COLOR?: string,
		PARENT_ID?: string 
	} = await request.json()

	const success = await DBFolder.UpdateFolder(
		{ TOKEN: token.value },
		FOLDER_ID,
		folderProps.NAME,
		folderProps.COLOR,
		folderProps.PARENT_ID
	)

	return NextResponse.json({
		message: success ? "Success" : "Failed"
	}, {
		status: success ? 200 : 500
	})
}