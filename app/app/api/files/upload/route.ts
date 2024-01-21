// UPLOAD FILE
import { NextRequest, NextResponse } from "next/server";
import { MAX_STORAGE_BYTES } from "@/app/_helpers/constants";
import { CreateConnection } from "@/app/_helpers/db";
import {v4 as uuidv4} from 'uuid';
import { rmSync, writeFile } from "fs";
import mysql from 'mysql2/promise'

interface IFileInfo {
  FILE_ID: string
  FILENAME: string
  EXTENSION: string
  NAME: string
}

async function UploadFile(request: NextRequest): Promise<NextResponse> {
  const data = await request.formData()
  const file: File | null = data.get('file') as File
  if(!file) {
    return new NextResponse("No file has been sent", { status: 400 } )
  }

  // get file info
  const {FILE_ID, EXTENSION, NAME} = await getFileInfo(file)
  
  // Get a random user
  const connection: mysql.Connection = await CreateConnection()
  let USER_ID: string = await connection.query(`SELECT ID FROM USER ORDER BY RAND() LIMIT 1`)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]['ID']);

  let SQL: string = `
    SELECT USER.*, SUM(SIZE_BYTES) AS USED_STORAGE_BYTES
    FROM FILE
      INNER JOIN OWNERSHIP ON FILE_ID=FILE.ID
      INNER JOIN USER ON USER_ID=USER.ID
    WHERE USER.ID='${USER_ID}'
    GROUP BY USER.ID;
  `;
  
  const RESP = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]);

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
  try {
    const SAVED_NAME = await SaveFileToDatabase(connection, FILE_ID, NAME, EXTENSION, USER_ID, PATH, file.size)
    return new NextResponse(
      `Successfully uploaded file ${SAVED_NAME}`,
      { status: 200 }
    )
  } catch (e) {
    rmSync(PATH, { force: true })
    return new NextResponse(
      e.message, { status: 500 }
    )
  }
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
  EXTENSION: string, USER_ID: string, PATH: string, FILE_SIZE: number): Promise<string> {

  let SQL: string = `INSERT INTO FILE VALUES (
    '${FILE_ID}', '${NAME}', '${EXTENSION}', '${NAME}${EXTENSION}',
    'a new file', '${PATH}', ${FILE_SIZE}, DEFAULT, NULL, NULL
  );`
  await connection.query(SQL);
  
  SQL = `INSERT INTO OWNERSHIP VALUES ('${USER_ID}', '${FILE_ID}', NULL, 1);`
  await connection.query(SQL);

  SQL = `SELECT FILENAME FROM FILE WHERE ID='${FILE_ID}'`
  const fileName: string = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]['FILENAME'])

  return fileName
}

export {UploadFile as POST}