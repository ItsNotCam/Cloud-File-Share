// GET USER FILES
import { CreateConnection } from '@/app/_helpers/db';
import { FileProps } from "@/app/_helpers/types";

import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'

export async function GetFilesFromUserWithID(USER_ID: string): Promise<FileProps[]> {
  const connection: mysql.Connection = await CreateConnection()
  let SQL: string = `SELECT * FROM FILE WHERE OWNER_ID='${USER_ID}'`
  const [res] = await connection.query(SQL)
  return res as FileProps[]
}

export async function GET(request: NextRequest, context: { params: any }): Promise<NextResponse> {
  const USER_ID: string = context.params.USER_ID
  const res = await GetFilesFromUserWithID(USER_ID)

  if(res.length < 1) {
    return NextResponse.json({
      message: "User does not exist"
    }, {
      status: 400
    })
  }

  return NextResponse.json({
    message: "success",
    files: res
  }, {
    status: 200
  })
}