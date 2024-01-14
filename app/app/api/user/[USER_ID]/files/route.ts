// GET USER FILES

"use server"

import { CreateConnection } from '@/app/helpers/DB';
//https://jasonwatmore.com/next-js-13-mysql-user-registration-and-login-tutorial-with-example-app

import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, context: { params: any }): Promise<NextResponse> {
  // const queryParams = request.nextUrl.searchParams

  const connection: mysql.Connection = await CreateConnection()
  let SQL: string = `SELECT * FROM FILE WHERE OWNER_ID='${context.params.USER_ID}'`
  const [res] = await connection.query(SQL)

  return NextResponse.json({
    files: res
  }, {
    status: 200
  })
}