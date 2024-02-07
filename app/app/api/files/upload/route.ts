// UPLOAD FILE
import { NextRequest, NextResponse } from "next/server";
import { rm, writeFile } from "fs";

export interface IFileInfo {
  FILE_ID: string
  FILENAME: string
  EXTENSION: string
  NAME: string
}
import { cookies } from "next/headers";
import DBAuth from "@/lib/db/DBAuth";
import Logger from "@/lib/logger";
import { getFileInfo } from "@/lib/util";
import DBFile from "@/lib/db/DBFiles";

async function UploadFile(request: NextRequest): Promise<NextResponse> {
	Logger.LogReq(request)
  const data = await request.formData()
  const file: File = data.get('file') as File
  if(!file) {
    return new NextResponse("No file has been sent", { status: 400 } )
  }

  // get file info
  const {FILE_ID, EXTENSION, NAME} = await getFileInfo(file)
  
  // Get user from token
	const token = cookies().get("token")?.value || "";
	const USER = await DBAuth.GetUserFromToken(token)

	if(USER === undefined) {
		return new NextResponse(
			`User doesnt exist`,
			{ status: 200 }
		)
	}

  // Save file to PC
  const PATH = `${process.env.FILES_DIRECTORY}/${FILE_ID}`
  const buffer = await file.arrayBuffer()
    .then(bytes => Buffer.from(bytes))
  writeFile(PATH, buffer, () => {})
  
  // Add entry to database
	const success = DBFile.SaveFile(FILE_ID, NAME, EXTENSION, USER.ID, PATH, file.size)

  if(!success) {
		rm(PATH, () => { return "deleted" })
    return new NextResponse(
      "Error saving file to the database", { status: 500 }
    )
  }

	return NextResponse.json({
		ID: FILE_ID
	}, { 
		status: 200 
	})
}

export {UploadFile as POST}