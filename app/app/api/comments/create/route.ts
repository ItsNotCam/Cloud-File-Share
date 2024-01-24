import { CreateConnection } from "@/lib/db"
import { IComment } from "@/app/_helpers/types"
import { NextResponse } from "next/server"

const errMsgs: Map<number, string> = new Map([
  [1216, "File and/or User ID not found"]
])

const validateJSON = (comment: IComment): boolean => {
  if(comment == null || comment == undefined){
    return false
  }

  const {FILE_ID, USER_ID, COMMENT} = comment
  if(FILE_ID == null || FILE_ID == undefined) {
    return false
  }
  
  if(USER_ID == null || USER_ID == undefined) {
    return false
  }
  
  if(COMMENT == null || COMMENT == undefined) {
    return false
  }

  return true
}

export async function POST(request: Request) {
  const js: IComment = await request.json()
  const validJSON: boolean = validateJSON(js)

  if(!validJSON) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 })
  }
  
  const {FILE_ID, USER_ID, COMMENT} = js
  const SQL: string = `INSERT INTO COMMENT VALUES ('${FILE_ID}', '${USER_ID}', '${COMMENT}');`
  const connection = await CreateConnection()
  const code: number = await connection.query(SQL)
    .then(_ => -1).catch(e => e.errno)
  
  if(code != -1) {
    console.log(code)
    return NextResponse.json({
      message: errMsgs.get(code)
    }, {
      status: 400
    })
  }

  return NextResponse.json({
    message: 'Comment added',
    comment: COMMENT
  }, {
    status: 200
  })
}