// GET ALL FILES
import { CreateConnection } from '@/app/_helpers/db';
import { IAdminFileProps } from "@/app/_helpers/types";

import { NextRequest, NextResponse } from 'next/server'

async function GetFiles(): Promise<{files: IAdminFileProps[]}> {
  let SQL: string = `
    SELECT FILE.*, USER.EMAIL, USER.CREATED
    FROM FILE LEFT JOIN USER ON USER.ID=FILE.OWNER_ID
    ORDER BY SIZE_BYTES DESC
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