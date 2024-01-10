"use server"

import { CreateConnection } from '@/app/helpers/DB';
//https://jasonwatmore.com/next-js-13-mysql-user-registration-and-login-tutorial-with-example-app

import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const queryParams = request.nextUrl.searchParams
  const user = queryParams.get("user")

  let SQL: string = "SELECT * FROM FILE"
  if( user !== null) {
    console.log(user)
    SQL = `${SQL} WHERE ORIGINAL_OWNER_EMAIL='${user}'`
  }

  const connection: mysql.Connection = await CreateConnection()
  const [res] = await connection.query(SQL)
  return NextResponse.json({
    files: res
  }, {
    status: 200
  })
}