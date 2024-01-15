// UPLOAD FILE

"use server"

import { CreateConnection } from "@/app/_helpers/DB";
import { writeFile } from "fs";
import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'
import {v4 as uuidv4} from 'uuid';

const EXTENSION_REGEX = /(.*)(\.\w*)$|(.*)$/g

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log(`GOT FILE`)
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File


  if(!file) {
    return NextResponse.json({ success: false })
  }

  const [FILE_ID, FILENAME, EXTENSION, NAME] = await getFileInfo(file)

  // Save file to PC
  const PATH = `${process.env.FILES_DIRECTORY}/${FILE_ID}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  await writeFile(PATH, buffer, () => {})
  console.log(`open ${PATH} to see the uploaded file`)
  // const FILE_SIZE = await Fs.stat(PATH).then(stats => stats.size)
  const FILE_SIZE = file.size || 0 //data.get('filesize') || 0

  const connection: mysql.Connection = await CreateConnection()
  
  // Get a random user
  let SQL: string = `SELECT ID FROM USER ORDER BY RAND() LIMIT 1`
  const USER_ID = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]['ID']);
  console.log(USER_ID)

  // Add entry to database
  const SAVED_NAME = await SaveFileToDatabase(connection, FILE_ID, FILENAME, NAME, EXTENSION, USER_ID, PATH, FILE_SIZE)
  return NextResponse.json({ success: true, filename: SAVED_NAME, id: FILE_ID })
}

async function getFileInfo(file: File): Promise<string[]> {
  let EXTENSION: string = ""
  let NAME: string = file.name
  let FILENAME: string = file.name

  let regex = new RegExp(EXTENSION_REGEX)
  let match = regex.exec(FILENAME)

  if(match) {
    EXTENSION = match[2] || ""
    NAME = match[1] || ""
    FILENAME = match[0]
  }

  return [uuidv4(), FILENAME, EXTENSION, NAME]
}


const SaveFileToDatabase = async (connection: mysql.Connection, FILE_ID: string, FILENAME: string, NAME: string, 
  EXTENSION: string, USER_ID: string, PATH: string, FILE_SIZE: number): Promise<string> => {

  let SQL: string = `INSERT INTO FILE VALUES (
    '${FILE_ID}', '${FILENAME}', '${NAME}', '${EXTENSION}', '${EXTENSION}',
    '${USER_ID}', 'a new file', '${PATH}', ${FILE_SIZE}, DEFAULT, NULL, NULL
  );`

  await connection.query(SQL);
  
  SQL = `INSERT INTO OWNERSHIP VALUES ('${USER_ID}', '${FILE_ID}', NULL, DEFAULT);`
  await connection.query(SQL);

  SQL = `SELECT FILENAME FROM FILE WHERE ID='${FILE_ID}'`
  const SAVED_NAME = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]['FILENAME'])

  return SAVED_NAME
}