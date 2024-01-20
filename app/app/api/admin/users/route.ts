// GET ALL USERS
import { CreateConnection } from '@/app/_helpers/db';
import { NextResponse } from 'next/server'

export async function GET(request: Request): Promise<NextResponse> {
  const SQL: string = `
    SELECT USER.*, SUM(SIZE_BYTES) AS USED_STORAGE_BYTES
    FROM FILE
      INNER JOIN OWNERSHIP ON FILE_ID=FILE.ID
      INNER JOIN USER ON USER_ID=USER.ID
    GROUP BY USER.ID;
  `

  const connection = await CreateConnection()
  const [res] = await connection.query(SQL)
  return NextResponse.json({
    users: res
  }, {
    status: 200
  })
}