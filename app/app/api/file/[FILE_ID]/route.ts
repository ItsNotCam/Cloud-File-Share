// FILE ACTIONS

"use server"

import { CreateConnection } from '@/app/_helpers/DB';
import fs from 'fs';
import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'


interface IFileUpdate {
  DESCRIPTION: string | undefined,
  NAME: string | undefined
}

interface IFileIDContext {
  params: { FILE_ID: string }
}

// Get file data
export async function GET(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
  console.log(context)
  const { FILE_ID } = context.params;

  const SQL: string = `SELECT 
    ID, NAME, EXTENSION, FILE_TYPE, OWNER_ID, DESCRIPTION, SIZE_BYTES, UPLOAD_TIME, LAST_DOWNLOAD_TIME, LAST_DOWNLOAD_USER_ID
    FROM FILE 
    WHERE ID='${FILE_ID}'
  `
  const connection: mysql.Connection = await CreateConnection()

  const file: object = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0])

  // const downloaderID: object = file['LAST_DOWNLOAD_USER_ID']
  // if(downloaderID != null) {
  //   const GET_USERNAME_SQL: string = `SELECT EMAIL FROM USER WHERE ID='${downloaderID}'`
  //   const resp = await connection.query(GET_USERNAME_SQL)
  //     .then(resp => resp.entries())
  //     .then(entries => entries.next().value)
  //     .then(value => value[1][0])
    
  //   file.LAST_DOWNLOAD_USER_ID = resp['LAST_DOWNLOAD_USER_ID']
  // }

  return NextResponse.json(file, { status: 200 })
}

// Delete file from database
export async function DELETE(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
  const { FILE_ID } = context.params

  const connection: mysql.Connection = await CreateConnection()

  // get the file path of the saved file
  const PATH: string = await connection.query(`SELECT INTERNAL_FILE_PATH FROM FILE WHERE ID='${FILE_ID}'`)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]['INTERNAL_FILE_PATH'])

  // remove from folder structure
  fs.rmSync(PATH, { force: true })

  // remove from tables
  let OWN_SQL: string = `DELETE FROM OWNERSHIP WHERE FILE_ID='${FILE_ID}'`
  await connection.execute(OWN_SQL)
  let COMM_SQL: string = `DELETE FROM COMMENT WHERE FILE_ID='${FILE_ID}'`
  await connection.execute(COMM_SQL)
  let FILE_SQL: string = `DELETE FROM FILE WHERE ID='${FILE_ID}'`
  await connection.execute(FILE_SQL)

  return NextResponse.json({
    message: "file deleted"
  }, {
    status: 200
  })
}

// Update file information
export async function PATCH(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
  const { FILE_ID } = context.params
  
  const js: IFileUpdate = await request.json()
  const { DESCRIPTION, NAME } = js;

  let mods: string[] = []
  if(DESCRIPTION && DESCRIPTION !== undefined && DESCRIPTION.length > 0) {
    mods = mods.concat([`DESCRIPTION='${DESCRIPTION}'`])
  }
  if(NAME && NAME !== undefined && NAME.length > 0) {
    mods = mods.concat([`NAME='${NAME}'`])
  }
  
  try {
    let SQL: string = ""
    if(mods.length > 0) {
      SQL = `UPDATE FILE SET ${mods.join(',')} WHERE ID='${FILE_ID}';`
      await CreateConnection().then(connection => connection.execute(SQL))
      return NextResponse.json({ message: "updated description" }, { status: 200 })
    } else {
      return NextResponse.json({ message: "no changes were made" }, { status: 200 })
    }
  } catch(e: any) {
    return NextResponse.json({
      message: e.message,
    }, {
      status: 500
    })
  }
}