// GET ALL FILES
import { CreateConnection } from '@/app/_helpers/db';
import { IAdminFileProps } from "@/app/_helpers/types";

import { NextRequest, NextResponse } from 'next/server'

async function GetFiles(): Promise<{files: IAdminFileProps[]}> {
  
  // select all user and file information from each file and its cooresponding owner
  let SQL = `
    SELECT USER.*, FILE.*
    FROM USER 
      INNER JOIN OWNERSHIP ON USER.ID = OWNERSHIP.USER_ID 
      INNER JOIN FILE ON FILE.ID = FILE_ID;
  `

  const [files] = await CreateConnection()
    .then(connection => connection.query(SQL))

  return {files: files as IAdminFileProps[]}
}

async function GET(request: NextRequest): Promise<NextResponse> {
  const {files} = await GetFiles()
  return NextResponse.json({
    message: "success",
    files: files
  }, {
    status: 200
  })
}

export {GET, GetFiles}