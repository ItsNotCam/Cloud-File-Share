// DOWNLOAD FILE
"use server"

import { CreateConnection, QueryGetFirst } from '@/lib/db'
import mysql from 'mysql2/promise'
import fs, { Stats } from 'fs'
import { NextResponse } from 'next/server'
import { ReadableOptions } from 'stream'
import { cookies } from 'next/headers'

interface IFileData {
  FILENAME: string
  INTERNAL_FILE_PATH: string
}

async function DownloadFile(request: Request, context: { params: any }, response: Response): Promise<NextResponse> {
  const { FILE_ID } = context.params;
	const token = cookies().get("token")?.value

	// get file name and internal file path only if the user owns the file
  const SQL: string = `
		SELECT CONCAT(NAME, EXTENSION) AS FILENAME, INTERNAL_FILE_PATH 
		FROM FILE_OBJECT AS FO
			INNER JOIN FILE_INSTANCE AS FI ON FO.ID=FI.FILE_ID
			INNER JOIN AUTH ON TOKEN='${token}'
		WHERE FO.ID='${FILE_ID}' 
			AND FI.USER_ID=(SELECT USER_ID FROM AUTH WHERE TOKEN='${token}')
	`

  const connection: mysql.Connection = await CreateConnection()
  const fileData: IFileData = await QueryGetFirst(connection, SQL)
	
  const {FILENAME, INTERNAL_FILE_PATH} = fileData;
  const data: ReadableStream<Uint8Array> = streamFile(INTERNAL_FILE_PATH);
  const stats: Stats = await fs.promises.stat(INTERNAL_FILE_PATH); 

  return new NextResponse(data, {                                   // Create a new NextResponse for the file with the given stream from the disk
    status: 200,                                                    // STATUS 200: HTTP - Ok
    headers: new Headers({                                          // Headers
        "content-disposition": `attachment; filename=${FILENAME}`,  // State that this is a file attachment
        "content-type": "application/iso",                          // Set the file type to an iso
        "content-length": `${stats.size}`                           // State the file size
    }),
  });
}

// Thanks https://github.com/vercel/next.js/discussions/15453#discussioncomment-6748645
function streamFile(path: string, options?: ReadableOptions): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
      start(controller) {
          downloadStream.on("data", (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
          downloadStream.on("end", () => controller.close());
          downloadStream.on("error", (error: NodeJS.ErrnoException) => controller.error(error));
      },
      cancel() {
          downloadStream.destroy();
      },
  });
}


export {DownloadFile as GET}