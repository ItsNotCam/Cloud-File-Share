// FILE ACTIONS

"use server"

import { CreateConnection } from '@/app/helpers/DB';
import fs from 'fs';
//https://jasonwatmore.com/next-js-13-mysql-user-registration-and-login-tutorial-with-example-app

import mysql from 'mysql2/promise'
import { NextResponse } from 'next/server'

export async function GET(request: Request, context: { params: any }): Promise<NextResponse> {
  const {FILE_ID} = context.params;

  const SQL: string = `SELECT * FROM FILE WHERE ID='${FILE_ID}'`
  const connection: mysql.Connection = await CreateConnection()

  const file: string = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0])

  return NextResponse.json({
    file: file
  }, {
    status: 200
  })
}

export async function DELETE(request: Request, context: { params: any }): Promise<NextResponse> {
  const {FILE_ID} = context.params

  const connection: mysql.Connection = await CreateConnection()

  // get the file path of the saved file
  const PATH: string = await connection.query(`SELECT INTERNAL_FILE_PATH FROM FILE WHERE ID='${FILE_ID}'`)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]['INTERNAL_FILE_PATH'])

  // remove from folder structure
  fs.rmSync(PATH, { force: true })

  // remove from tables
  let SQL: string = `DELETE FROM OWNERSHIP WHERE FILE_ID='${FILE_ID}'`
  await connection.query(SQL)
  SQL = `DELETE FROM COMMENT WHERE FILE_ID='${FILE_ID}'`
  await connection.query(SQL)
  SQL = `DELETE FROM FILE WHERE ID='${FILE_ID}'`
  await connection.query(SQL)

  return NextResponse.json({
    message: "file deleted"
  }, {
    status: 200
  })
}