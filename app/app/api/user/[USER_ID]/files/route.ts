// GET USER FILES

"use server"

import { CreateConnection } from '@/app/_helpers/DB';
//https://jasonwatmore.com/next-js-13-mysql-user-registration-and-login-tutorial-with-example-app

import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'

async function GetFilesFromUserWithID(request: NextRequest, context: { params: any }): Promise<NextResponse> {
  const connection: mysql.Connection = await CreateConnection()
  let SQL: string = `SELECT * FROM FILE WHERE OWNER_ID='${context.params.USER_ID}'`
  const [res] = await connection.query(SQL)

  return NextResponse.json({
    files: res
  }, {
    status: 200
  })
}

export {GetFilesFromUserWithID as GET}