// UPLOAD FILE
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import {v4 as uuidv4} from 'uuid'
import { cookies } from "next/headers";
import DBAuth from "@/lib/db/DBAuth";
import Logger from "@/lib/logger";
import { getFileInfo } from "@/lib/util";
import DBFile from "@/lib/db/DBFiles";

export interface IFileInfo {
  FILE_ID: string
  FILENAME: string
  EXTENSION: string
  NAME: string
}

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

	try {
		// Save file to PC
		const PATH = `${process.env.FILES_DIRECTORY}/${uuidv4()}`
		await FSSaveFile(file, PATH)

		// Add entry to database
		const success = DBFile.SaveFile(FILE_ID, NAME, EXTENSION, USER.ID, PATH, file.size)

		if(!success) {
			fs.rm(PATH, () => { return "deleted" })
			return new NextResponse(
				"Error saving file to the database", { status: 500 }
			)
		}
	} catch(err: any) {
		Logger.LogErr(`Error saving file ${err.message}`)
	}

	return NextResponse.json({
		ID: FILE_ID
	}, { 
		status: 200 
	})
}


export const FSSaveFile = async (file: File, PATH: string): Promise<boolean> => {
	const uploadStream = fs.createWriteStream(PATH);
	await file.stream().pipeTo(new WritableStream({
		write(chunk) {
			uploadStream.write(chunk);
		}
	})).finally(() => {
		uploadStream.close();
	});

	return true;
};


export {UploadFile as POST}