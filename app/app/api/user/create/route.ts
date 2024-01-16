// User actions
import { CreateConnection } from "@/app/_helpers/db";
import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'
import { IUserProps } from "@/app/_helpers/types";

async function CreateUser(request: NextRequest): Promise<NextResponse> {
  const {EMAIL, PASSWORD}: IUserProps = await request.json()
  
  const connection: mysql.Connection = await CreateConnection()
  const SQL: string = `INSERT INTO USER VALUES (DEFAULT, '${EMAIL}', '${EMAIL}', '${PASSWORD}', DEFAULT, NULL)`
  await connection.execute(SQL)
  
  return NextResponse.json({ message: "success" }, { status: 200 })
}

export {CreateUser as POST}