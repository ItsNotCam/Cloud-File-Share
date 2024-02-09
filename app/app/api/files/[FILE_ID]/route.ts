// FILE ACTIONS
import DBAuth from '@/lib/db/DBAuth';
import DBFile from '@/lib/db/DBFiles';
import Logger from '@/lib/logger';
import fs from 'fs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

interface IFileIDContext {
	params: { FILE_ID: string }
}

// Get file data
export async function GET(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
	Logger.LogReq(request)
	const { FILE_ID } = context.params;

	const file = await DBFile.GetFileInfo(FILE_ID, {
    TOKEN: cookies().get("token")?.value
  })

	if(file === undefined) {
		return NextResponse.json({message: "No file found"}, { status: 401 })
	}

	return NextResponse.json(file, { status: 200 })
}

// Delete file from database
export async function DELETE(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
	Logger.LogReq(request)
	const { FILE_ID } = context.params
	const token = cookies().get("token")?.value
	if(token === undefined) {
		Logger.LogErr(`User requested ${request.url} without validation`)
		return NextResponse.json({mesage: "unauthorized"}, {status: 403})
	}

	const user = await DBAuth.GetUserFromToken(token)
	if(user === undefined) {
		Logger.LogErr(`No user found using token ${token}`)
		return NextResponse.json({message: "unauthorized"}, {status: 403})
	}

  const PATH = await DBFile.DeleteFile(FILE_ID, { 
    USER_ID: user?.ID,
  })

  if(PATH != undefined) {
    // remove from folder structure
		try {
			if(fs.existsSync(PATH)) {
				fs.rm(PATH, () => {})
				return NextResponse.json({ message: "file deleted" }, { status: 200 })
			} else {
				throw {message: `File ${FILE_ID} does not exist`}
			}
		} catch(err: any) {
			Logger.LogErr(`Failed to delete file ${FILE_ID} from storage: ${err.message}`)
		}

		return NextResponse.json({
			message: "failed"
		}, {
			status: 500
		})
  }

	return NextResponse.json({
		message: "file was not deleted"
	}, {
		status: 500
	})
}

// Update file information
export async function PATCH(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
	Logger.LogReq(request)
	const { FILE_ID } = context.params

	const { description, name } = await request.json() as { 
    description?: string, 
    name?: string 
  }

	try {
		if (description !== undefined || name !== undefined) {
      const identifier = {
        TOKEN: cookies().get("token")?.value
      }

      const info = {
        DESCRIPTION: description?.substring(0, 5000),
        NAME: name?.substring(0,64)
      }

      const success = await DBFile.UpdateFileInfo(FILE_ID, identifier, info)
			if(success) {
				return NextResponse.json({ 
					message: "updated file"
				}, { 
					status: 200 
				})
			}
		}
	} catch (err: any) {
		Logger.LogErr(`Failed to update file information: ${err.message}`)
		return new NextResponse(
			err.message, { status: 500 }
		)
	}
	
	return NextResponse.json({ message: "No changes were made" }, { status: 200 })
}