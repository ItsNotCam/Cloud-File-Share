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
		return NextResponse.json({
			message: "No file was sent"
    }, {
			status: 400
    })
  }

	let folder: string | null= data.get('folder') as string
	if(folder.length < 1) {
		folder = null;
	}

  // get file info
  const {FILE_ID, EXTENSION, NAME} = await getFileInfo(file)
  
  // Get user from token
	const token = cookies().get("token")?.value || "";
	const USER = await DBAuth.GetUserFromToken(token)

	if(USER === undefined) {
		return NextResponse.json({
      message: "User does not exist"
    }, {
      status: 400
    })
	}

	try {
		// Save file to PC
		const PATH = `${process.env.FILES_DIRECTORY}/${uuidv4()}`
		await FSSaveFile(file, PATH)

		// Add entry to database
		const success = await DBFile.SaveFile(FILE_ID, NAME, EXTENSION, USER.ID, PATH, file.size, folder)

		if(!success) {
			fs.rm(PATH, () => { return "deleted" })
      throw {message: "Error saving file to the database - deleting file"}
		}
    
    // const newFiles = await DBFile.GetFilesOfUser({USER_ID: USER.ID}, null)
    return NextResponse.json({
      message: "success"
    }, { 
      status: 200 
    })
	} catch(err: any) {
		Logger.LogErr(`Error saving file ${err.message}`)
	}

  return NextResponse.json({
    message: "Error saving file"
  }, {
    status: 500
  })
}


const FSSaveFile = async (file: File, PATH: string): Promise<boolean> => {
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