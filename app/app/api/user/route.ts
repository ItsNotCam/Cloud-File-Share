// User actions
import { CreateConnection } from "@/app/_helpers/DB";
import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'
import { IUserProps } from "@/app/_helpers/types";

async function CreateUser(request: NextRequest): Promise<NextResponse> {
  const js: IUserProps = await request.json()
  const {EMAIL, PASSWORD} = js

  const connection: mysql.Connection = await CreateConnection()
  const SQL: string = `INSERT INTO USER VALUES (DEFAULT, '${EMAIL}', '${PASSWORD}', DEFAULT, NULL)`
  await connection.execute(SQL)
  
  return NextResponse.json({ message: "success" }, { status: 200 })
}

async function GetUser(request: NextRequest, context: { params: any }): Promise<NextResponse> {
  const EMAIL: string | null = request.nextUrl.searchParams.get('EMAIL')
  const ID: string | null = request.nextUrl.searchParams.get('ID')
  
  const IDENTIFIER: string | null = EMAIL || ID
  const SQL: string = `SELECT * FROM USER WHERE ID='${IDENTIFIER}' OR EMAIL='${IDENTIFIER}'`
  const connection: mysql.Connection = await CreateConnection()
  const resp = await connection.execute(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0])

  return NextResponse.json(resp, { status: 200 })
}

export {CreateUser as POST, GetUser as GET}