// FILE ACTIONS
import DBFile from '@/lib/db/DBFiles';
import fs from 'fs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

interface IFileIDContext {
	params: { FILE_ID: string }
}

// Get file data
async function GET(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
	const { FILE_ID } = context.params;
	const file = await DBFile.GetFileInfo(FILE_ID, {
    TOKEN: cookies().get("token")?.value
  })
	return NextResponse.json(file, { status: 200 })
}

// Delete file from database
async function DELETE(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
	const { FILE_ID } = context.params
  const PATH = await DBFile.DeleteFile(FILE_ID, { 
    TOKEN: cookies().get("token")?.value,
  })

  if(PATH != undefined) {
    // remove from folder structure
    fs.rmSync(PATH, { force: true })
    return NextResponse.json({
      message: "file deleted"
    }, {
      status: 200
    })
  }

	return NextResponse.json({
		message: "file was not deleted"
	}, {
		status: 500
	})
}

// Update file information
async function PATCH(request: NextRequest, context: IFileIDContext): Promise<NextResponse> {
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

      await DBFile.UpdateFileInfo(FILE_ID, identifier, info)

			return NextResponse.json({ 
				message: "updated file"
			}, { 
        status: 200 
      })
		} else {
			return NextResponse.json({ message: "No changes were made" }, { status: 200 })
		}
	} catch (e: any) {
    console.log(e.message)
		return new NextResponse(
			e.message, { status: 500 }
		)
	}
}