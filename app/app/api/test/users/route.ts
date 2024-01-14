// GET ALL USERS

"use server"

//https://jasonwatmore.com/next-js-13-mysql-user-registration-and-login-tutorial-with-example-app
import { CreateConnection } from '@/app/helpers/DB';
import { NextResponse } from 'next/server'

export async function GET(request: Request): Promise<NextResponse> {
  const SQL: string = "SELECT * FROM USER"

  const connection = await CreateConnection()
  const [res] = await connection.query(SQL)
  return NextResponse.json({
    users: res
  }, {
    status: 200
  })
}