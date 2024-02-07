// GET COMMENTS
{
  // GET
  const GET_SQL: string = `SELECT USER_ID, COMMENT FROM COMMENT WHERE COMMENT_ID='....'`

  // PATCH
  const PATCH_SQL: string = `UPDATE COMMENT SET COMMENT='....' WHERE COMMENT_ID='....'`

  // DELETE
  const DELETE_SQL: string = `DELETE FROM COMMENT WHERE COMMENT_ID='....'`
}

import Logger from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  Logger.LogReq(request)
  return NextResponse.json({
    message: 'Not Implemented'
  }, {
    status: 200
  })
}