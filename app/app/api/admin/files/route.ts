// GET ALL FILES
import { CreateConnection } from '@/app/_helpers/db';
import { FileProps } from "../../../_helpers/types";

import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'
import { FileList } from '../../../_helpers/types';

async function GetFiles(): Promise<FileList> {
  let SQL: string = "SELECT * FROM FILE"

  const connection: mysql.Connection = await CreateConnection()
  const [res] = await connection.query(SQL)

  return {files: res as FileProps[]}
}

async function GET(request: NextRequest): Promise<NextResponse> {
  const resp: object = await GetFiles()
  return NextResponse.json({
    message: "success",
    files: resp
  }, {
    status: 200
  })
}

export {GET, GetFiles}