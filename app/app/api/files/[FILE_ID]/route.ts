// FILE ACTIONS
import { CreateConnection, QueryGetFirst } from '@/lib/db';
import DBAuth from '@/lib/db/DBAuth';
import DBFile from '@/lib/db/DBFiles';
import { IFileUpdate } from '@/lib/types';
import fs from 'fs';
import mysql from 'mysql2/promise'
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

interface IFileIDContext {
	params: { FILE_ID: string }
}

// Get file data
async function GetFileInfo(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
	const { FILE_ID } = context.params;
	const token = cookies().get("token")?.value;

	const file = await DBFile.GetFileInfo(FILE_ID, {token: token})
	return NextResponse.json(file, { status: 200 })
}

// Delete file from database
async function DeleteFile(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
	const { FILE_ID } = context.params

	const token = cookies().get("token")?.value;
	const CAN_DELETE_SQL: string = `
		SELECT IS_OWNER FROM OWNERSHIP WHERE FILE_ID='${FILE_ID}' AND USER_ID=(SELECT USER_ID FROM AUTH WHERE TOKEN='${token}')
	`

	const connection = await CreateConnection()
	const resp = await QueryGetFirst(connection, CAN_DELETE_SQL)

	if (!resp.IS_OWNER.readInt8()) {
		return NextResponse.json({ message: "not allowed" }, { status: 403 })
	}

	return await DeleteFileByID(FILE_ID)
}

async function DeleteFileByID(FILE_ID: string): Promise<NextResponse> {
	const connection: mysql.Connection = await CreateConnection()

	// get the file path of the saved file
	const SQL: string = `SELECT INTERNAL_FILE_PATH FROM FILE WHERE ID='${FILE_ID}'`
	const PATH: string = (await QueryGetFirst(connection, SQL)).INTERNAL_FILE_PATH

	// remove from folder structure
	fs.rmSync(PATH, { force: true })

	// remove from tables
	let OWN_SQL: string = `DELETE FROM OWNERSHIP WHERE FILE_ID='${FILE_ID}'`
	await connection.execute(OWN_SQL)
	let COMM_SQL: string = `DELETE FROM COMMENT WHERE FILE_ID='${FILE_ID}'`
	await connection.execute(COMM_SQL)
	let FILE_SQL: string = `DELETE FROM FILE WHERE ID='${FILE_ID}'`
	await connection.execute(FILE_SQL)

	return NextResponse.json({
		message: "file deleted"
	}, {
		status: 200
	})
}

// Update file information
async function UpdateFileInfo(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
	const { FILE_ID } = context.params

	const js = await request.json() as { description?: string, name?: string }
	const { description, name } = js;

	let mods: string[] = []
	if (description !== undefined && description.length > 0) {
		mods.push(`DESCRIPTION='${description}'`)
	}
	if (name !== undefined && name.length > 0) {
		mods.push(`NAME='${name}'`)
	}

	try {
		let SQL: string = ""
		if (mods.length > 0) {
			const user_id = await DBAuth.GetUserFromToken(cookies().get("token")?.value || "")
			SQL = `UPDATE OWNERSHIP SET ${mods.join(',')} WHERE FILE_ID='${FILE_ID}' AND USER_ID='${user_id?.ID}';`
			console.log(SQL)

			const connection = await CreateConnection()
			const resp = await connection.execute(SQL)
			console.log(resp)

			return NextResponse.json({ 
				message: "updated description", 
				description: description 
			}, { status: 200 })
		} else {
			return NextResponse.json({ message: "No changes were made" }, { status: 200 })
		}
	} catch (e: any) {
		return new NextResponse(
			e.message, { status: 500 }
		)
	}
}

export { GetFileInfo as GET, DeleteFile as DELETE, UpdateFileInfo as PATCH, DeleteFileByID as DeleteFileByID }