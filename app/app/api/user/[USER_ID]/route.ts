// User actions

import { CreateConnection } from "@/app/helpers/DB";
import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'


interface IDeleteUser {
  EMAIL: string
}

export async function DELETE(request: NextRequest, context: { params: any }): Promise<NextResponse> {
  const USER_ID: string = context.params.USER_ID;

  const connection: mysql.Connection = await CreateConnection(true)
  const SQL: string = `DELETE FROM OWNERSHIP WHERE USER_ID='${USER_ID}';`
    // DELETE FROM USER WHERE ID='${USER_ID}';`
    // // DELETE FROM COMMENT WHERE USER_ID='${USER_ID}';
  await connection.execute(SQL)

  return NextResponse.json({ message: "success" }, { status: 200 })
}