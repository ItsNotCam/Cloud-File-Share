// UPLOAD FILE
import { NextRequest, NextResponse } from "next/server";
import { CreateConnection } from "@/lib/db";
import { rm, writeFile } from "fs";
import mysql from 'mysql2/promise'

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
  const connection: mysql.Connection = await CreateConnection()
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
  const result: number = await SaveFileToDatabase(connection, FILE_ID, NAME, EXTENSION, USER.ID, PATH, file.size)
    .then(_ => 0)
		.catch(err => {
			console.log(err)
			return -1
		})

  if(result === -1) {
		rm(PATH, () => { return "deleted" })
    // rmSync(PATH, { force: true })
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

async function SaveFileToDatabase(connection: mysql.Connection, FILE_ID: string, NAME: string, 
  EXTENSION: string, USER_ID: string, PATH: string, FILE_SIZE: number) {

  let SQL: string = `INSERT INTO FILE_OBJECT VALUES (
    '${FILE_ID}', '${EXTENSION}', '${PATH}', ${FILE_SIZE}, 
		DEFAULT, NULL, NULL
  );`
  await connection.query(SQL);
  
  SQL = `INSERT INTO FILE_INSTANCE VALUES (
		'${USER_ID}', '${FILE_ID}', NULL, 1, '${NAME}', ""
	)`;

  await connection.query(SQL);
}

export {UploadFile as POST}