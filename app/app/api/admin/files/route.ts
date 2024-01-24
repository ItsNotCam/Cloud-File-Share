// GET ALL FILES
import { CreateConnection } from '@/lib/db';
import { IAdminFileProps } from "@/lib/types";

import { NextRequest, NextResponse } from 'next/server'

async function GetFiles(): Promise<{files: IAdminFileProps[]}> {
  // select all user and file information from each file and its cooresponding owner
  let SQL = `
    SELECT 
      U.ID AS USER_ID, U.USERNAME, U.CREATED,
      F.ID AS FILE_ID, F.NAME, F.EXTENSION, F.FILENAME, F.DESCRIPTION, 
      F.SIZE_BYTES, F.UPLOAD_TIME, F.LAST_DOWNLOAD_TIME, F.LAST_DOWNLOAD_USER_ID
    FROM OWNERSHIP 
      INNER JOIN USER AS U ON U.ID = USER_ID 
      INNER JOIN FILE AS F ON F.ID = FILE_ID
    WHERE OWNERSHIP.IS_OWNER = 1
    ORDER BY F.FILENAME;
  `

  const [files] = await CreateConnection()
    .then(connection => connection.query(SQL))

  return {files: files as IAdminFileProps[]}
}

async function GET(request: NextRequest): Promise<NextResponse> {
  const {files} = await GetFiles()
  return NextResponse.json({
    count: files.length,
    files: files
  }, {
    status: 200
  })
}

export {GET, GetFiles}