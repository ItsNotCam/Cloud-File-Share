// GET ALL USERS
import { CreateConnection } from '@/app/_helpers/db';
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