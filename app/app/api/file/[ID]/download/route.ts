"use server"

import { CreateConnection } from '@/app/helpers/DB'
//https://jasonwatmore.com/next-js-13-mysql-user-registration-and-login-tutorial-with-example-app

import mysql from 'mysql2/promise'
import { NextResponse } from 'next/server'

interface FileContext {
  params: { ID: string }
}

export async function GET(request: Request, context: FileContext): Promise<NextResponse> {
  const { ID } = context.params;
  const SQL: string = `SELECT INTERNAL_FILE_PATH FROM FILE WHERE ID='${ID}'`
  
  const connection: mysql.Connection = await CreateConnection()
  const path: string = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1][0]['INTERNAL_FILE_PATH'])

  return NextResponse.json({
    path: path
  }, {
    status: 200
  })
}