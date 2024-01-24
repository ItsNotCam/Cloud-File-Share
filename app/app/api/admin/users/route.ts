// GET ALL USERS
import { CreateConnection } from '@/lib/db';
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
  const resp = await connection.query(SQL)
    .then(resp => resp.entries())
    .then(entries => entries.next().value)
    .then(value => value[1])
    
  return NextResponse.json({
    count: resp.length,
    users: resp
  }, {
    status: 200
  })
}