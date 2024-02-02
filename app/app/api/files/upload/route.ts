// UPLOAD FILE
import { MAX_STORAGE_BYTES } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import { CreateConnection, QueryGetFirst } from "@/lib/db";
import { rmSync, writeFile } from "fs";
import {v4 as uuidv4} from 'uuid';
import mysql from 'mysql2/promise'

interface IFileInfo {
  FILE_ID: string
  FILENAME: string
  EXTENSION: string
  NAME: string
}
import { IUserProps } from "@/lib/types";
import { cookies } from "next/headers";
import DBAuth from "@/lib/db/DBAuth";

async function UploadFile(request: NextRequest): Promise<NextResponse> {
  const data = await request.formData()
  const file: File = data.get('file') as File
	const DESCRIPTION: string = data.get('description') as string;
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

  let SQL: string = `
    SELECT USER.*, SUM(SIZE_BYTES) AS USED_STORAGE_BYTES
    FROM FILE_OBJECT AS FO
      INNER JOIN FILE_INSTANCE AS FI ON FI.FILE_ID=FO.ID
      INNER JOIN USER ON USER_ID=USER.ID
    WHERE USER.ID='${USER.ID}'
    GROUP BY USER.ID;
  `;
  
  const RESP: IUserProps = await QueryGetFirst(connection, SQL)
  if(RESP != undefined && (file.size + RESP.USED_STORAGE_BYTES) > MAX_STORAGE_BYTES) {
    return new NextResponse(
      "Uploading this file exceeded maximum storage",
      { status: 400 }
    )
  }

  // Save file to PC
  const PATH = `${process.env.FILES_DIRECTORY}/${FILE_ID}`
  const buffer = await file.arrayBuffer()
    .then(bytes => Buffer.from(bytes))
  await writeFile(PATH, buffer, () => {})
  
  // Add entry to database
  const result: number = await SaveFileToDatabase(connection, FILE_ID, NAME, EXTENSION, DESCRIPTION, USER.ID, PATH, file.size)
    .then(_ => 0)
		.catch(err => {
			console.log(err)
			return -1
		})

  if(result === -1) {
    rmSync(PATH, { force: true })
    return new NextResponse(
      "Error saving file to the database", { status: 500 }
    )
  }
  
  return new NextResponse(
    `Successfully uploaded file.`,
    { status: 200 }
  )
}

async function getFileInfo(file: File): Promise<IFileInfo> {
  const regex = new RegExp(/(.*)(\.\w*)$|(.*)$/g)
  const match = regex.exec(file.name)
  const [FILENAME, NAME, EXTENSION] = match ?? ["", file.name, file.name]
  return {
    FILE_ID: uuidv4(),
    FILENAME: FILENAME,
    EXTENSION: EXTENSION,
    NAME: NAME
  }
}


async function SaveFileToDatabase(connection: mysql.Connection, FILE_ID: string, NAME: string, 
  EXTENSION: string, DESCRIPTION: string, USER_ID: string, PATH: string, FILE_SIZE: number) {

  let SQL: string = `INSERT INTO FILE_OBJECT VALUES (
    '${FILE_ID}', '${EXTENSION}', '${PATH}', ${FILE_SIZE}, 
		DEFAULT, NULL, NULL
  );`
  await connection.query(SQL);
  
  SQL = `INSERT INTO FILE_INSTANCE VALUES (
		'${USER_ID}', '${FILE_ID}', NULL, 1, '${NAME}', 
		'${DESCRIPTION}'
	)`;

  await connection.query(SQL);
}

export {UploadFile as POST}