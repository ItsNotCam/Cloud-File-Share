// User actions
import { CreateConnection } from "@/app/_helpers/db";
import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise'
import { IUserProps } from "@/app/_helpers/types";

async function CreateUser(request: NextRequest): Promise<NextResponse> {
  const {USERNAME, EMAIL, PASSWORD}: IUserProps = await request.json()
  
  const errors: string[] = []

  if(EMAIL.length < 1) {
    errors.push("No email specified")
  }
  
  if(PASSWORD.length < 1) {
    errors.push("No password specified")
  }
  
  if(USERNAME.length < 1) {
    errors.push("No username specified")
  }

  if(errors.length > 0) {
    console.log(errors)
    return NextResponse.json({
      errors: errors
    }, { status: 400 })
  }

  const connection: mysql.Connection = await CreateConnection()
  const SQL: string = `INSERT INTO USER VALUES (DEFAULT, '${USERNAME}', '${EMAIL}', '${PASSWORD}', DEFAULT, NULL)`

  console.log(SQL)

  try {
    const resp: any = await connection.execute(SQL)
    console.log(resp)
  } catch(err) {
    console.log(err)
    const sqlError = err as mysql.QueryError;
    const errCode: string = sqlError.code;
    const msg: string = sqlError.message;

    console.log(errCode)
    console.log(msg)

    const {message, status} = GetError(sqlError)
    return NextResponse.json({
      message: message
    }, { status: status })
  }
  
  return NextResponse.json({ 
    message: "success" 
  }, { status: 200 })
}

const GetError = (sqlError: mysql.QueryError): {message: string, status: number} => {
  const {code, message} = sqlError

  const sqlErrors = {

  }

  return {message: "lol", status: 100}
}

export {CreateUser as POST}