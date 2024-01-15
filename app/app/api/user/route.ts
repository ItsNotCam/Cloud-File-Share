// User actions

import { CreateConnection } from "@/app/_helpers/DB";
import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'

interface ICreateUser {
  EMAIL: string,
  PASSWORD: string
}

interface IDeleteUser {
  EMAIL: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const js: ICreateUser = await request.json()
  const {EMAIL, PASSWORD} = js

  const connection: mysql.Connection = await CreateConnection()
  const SQL: string = `INSERT INTO USER VALUES (DEFAULT, '${EMAIL}', '${PASSWORD}', DEFAULT, NULL)`
  await connection.execute(SQL)

  return NextResponse.json({ message: "success" }, { status: 200 })
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const js: IDeleteUser = await request.json()
  const { EMAIL } = js

  // const GET_PASSWD_SQL: string = `SELECT COUNT(PASSWORD) FROM USER WHERE EMAIL='${EMAIL}'`
  // const resp

  const connection: mysql.Connection = await CreateConnection()
  const SQL: string = `DELETE FROM USER WHERE EMAIL='${EMAIL}'`
  await connection.execute(SQL)

  return NextResponse.json({ message: "success" }, { status: 200 })
}