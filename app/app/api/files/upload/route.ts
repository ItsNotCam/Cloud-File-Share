// UPLOAD FILE
import { CreateConnection } from "@/app/_helpers/db";
import { writeFile } from "fs";
import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'
import {v4 as uuidv4} from 'uuid';

async function UploadFile(request: NextRequest): Promise<NextResponse> {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File
  if(!file) {
    return NextResponse.json({ success: false })
  }

  const [FILE_ID, FILENAME, EXTENSION, NAME] = await getFileInfo(file)

  // Save file to PC
  const PATH = `${process.env.FILES_DIRECTORY}/${FILE_ID}`
  const buffer = await file.arrayBuffer().then(bytes => Buffer.from(bytes))
  await writeFile(PATH, buffer, () => {})
  const FILE_SIZE = file.size || 0

  // Get a random user
  const connection: mysql.Connection = await CreateConnection()
  let SQL: string = `SELECT ID FROM USER ORDER BY RAND() LIMIT 1`
  const USER_ID = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]['ID']);

  // Add entry to database
  const SAVED_NAME = await SaveFileToDatabase(connection, FILE_ID, NAME, EXTENSION, USER_ID, PATH, FILE_SIZE)
  return NextResponse.json({ filename: SAVED_NAME, id: FILE_ID })
}

async function getFileInfo(file: File): Promise<string[]> {
  let EXTENSION: string = ""
  let NAME: string = file.name
  let FILENAME: string = file.name
  
  let regex = new RegExp(/(.*)(\.\w*)$|(.*)$/g)
  let match = regex.exec(FILENAME)

  if(match) {
    EXTENSION = match[2] || ""
    NAME = match[1] || ""
    FILENAME = match[0]
  }

  return [uuidv4(), FILENAME, EXTENSION, NAME]
}


async function SaveFileToDatabase(connection: mysql.Connection, FILE_ID: string, NAME: string, 
  EXTENSION: string, USER_ID: string, PATH: string, FILE_SIZE: number): Promise<string> {

  let SQL: string = `INSERT INTO FILE VALUES (
    '${FILE_ID}', '${NAME}', '${EXTENSION}', '${EXTENSION}',
    '${USER_ID}', 'a new file', '${PATH}', ${FILE_SIZE}, DEFAULT, NULL, NULL
  );`

  await connection.query(SQL);
  
  SQL = `INSERT INTO OWNERSHIP VALUES ('${USER_ID}', '${FILE_ID}', NULL, DEFAULT);`
  await connection.query(SQL);

  SQL = `SELECT NAME, EXTENSION FROM FILE WHERE ID='${FILE_ID}'`
  const {recvdName, recvdExtension} = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0])

  return `${recvdName}${recvdExtension}`
}

export {UploadFile as POST}