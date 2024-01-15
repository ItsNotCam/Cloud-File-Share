// GET ALL FILES
import { CreateConnection } from '@/app/_helpers/db';
import { IFileProps } from "../../../_helpers/types";

import mysql from 'mysql2/promise'
import { NextRequest, NextResponse } from 'next/server'
import { IFileList } from '../../../_helpers/types';

async function GetFiles(): Promise<IFileList> {
  let SQL: string = "SELECT * FROM FILE ORDER BY SIZE_BYTES DESC"

  const connection: mysql.Connection = await CreateConnection()
  const [res] = await connection.query(SQL)

  return {files: res as IFileProps[]}
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