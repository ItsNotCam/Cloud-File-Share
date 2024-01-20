// UPLOAD FILE
import { MAX_STORAGE_BYTES } from "@/app/_helpers/constants";
import { NextRequest, NextResponse } from "next/server";
import { CreateConnection, QueryGetFirst } from "@/app/_helpers/db";
import { rmSync, writeFile } from "fs";
import {v4 as uuidv4} from 'uuid';
import mysql from 'mysql2/promise'
import { IUserProps } from "@/app/_helpers/types";

async function UploadFile(request: NextRequest): Promise<NextResponse> {
  const data = await request.formData()
  const file: File | null = data.get('file') as File
  if(!file) {
    return new NextResponse("No file has been sent", { status: 400 } )
  }

  // get file info
  const [FILE_ID, _, EXTENSION, NAME] = await getFileInfo(file)
  
  // Get a random user
  const connection: mysql.Connection = await CreateConnection()
  let USER_ID: string = (await QueryGetFirst(connection, `SELECT ID FROM USER ORDER BY RAND() LIMIT 1`) as {ID: string}).ID
  let SQL: string = `
    SELECT USER.*, SUM(SIZE_BYTES) AS USED_STORAGE_BYTES
    FROM FILE
      INNER JOIN OWNERSHIP ON FILE_ID=FILE.ID
      INNER JOIN USER ON USER_ID=USER.ID
    WHERE USER.ID='${USER_ID}'
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
  const result: number = await SaveFileToDatabase(connection, FILE_ID, NAME, EXTENSION, USER_ID, PATH, file.size)
    .then(_ => 0).catch(_ => -1)

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

async function getFileInfo(file: File): Promise<string[]> {
  let EXTENSION: string = ""
  let NAME: string = file.name
  let FILENAME: string = file.name
  
  let regex = new RegExp(/(.*)(\.\w*)$|(.*)$/g)
  let match = regex.exec(FILENAME)

  if(match) {
    FILENAME = match[0] || ""
    NAME = match[1] || ""
    EXTENSION = match[2] || ""
  }

  return [uuidv4(), FILENAME, EXTENSION, NAME]
}


async function SaveFileToDatabase(connection: mysql.Connection, FILE_ID: string, NAME: string, 
  EXTENSION: string, USER_ID: string, PATH: string, FILE_SIZE: number): Promise<string> {

  let SQL: string = `INSERT INTO FILE VALUES (
    '${FILE_ID}', '${NAME}', '${EXTENSION}', '${NAME}${EXTENSION}',
    'a new file', '${PATH}', ${FILE_SIZE}, DEFAULT, NULL, NULL
  );`
  await connection.query(SQL);
  
  SQL = `INSERT INTO OWNERSHIP VALUES ('${USER_ID}', '${FILE_ID}', NULL, 1);`
  await connection.query(SQL);

  SQL = `SELECT FILENAME FROM FILE WHERE ID='${FILE_ID}'`
  const fileName: string = (await QueryGetFirst(connection, SQL) as {FILENAME: string}).FILENAME

  return fileName
}

export {UploadFile as POST}