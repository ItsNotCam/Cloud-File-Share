// DOWNLOAD FILE
"use server"

import { CreateConnection, QueryGetFirst } from '@/app/_helpers/db'
import mysql from 'mysql2/promise'
import fs, { Stats } from 'fs'
import { NextResponse } from 'next/server'
import { ReadableOptions } from 'stream'

type FileData = {
  NAME: string
  EXTENSION: string
  INTERNAL_FILE_PATH: string
}

async function DownloadFile(request: Request, context: { params: any }, response: Response): Promise<NextResponse> {
  const { FILE_ID } = context.params;
  const SQL: string = `SELECT NAME, EXTENSION, INTERNAL_FILE_PATH FROM FILE WHERE ID='${FILE_ID}'`
  console.log(SQL)

  const connection: mysql.Connection = await CreateConnection()
  const fileData: FileData = await QueryGetFirst(connection, SQL)
  const {NAME, EXTENSION, INTERNAL_FILE_PATH} = fileData;

  const fileName: string = `${NAME}${EXTENSION}`
  const data: ReadableStream<Uint8Array> = streamFile(INTERNAL_FILE_PATH);
  const stats: Stats = await fs.promises.stat(INTERNAL_FILE_PATH); 

  return new NextResponse(data, {                                   // Create a new NextResponse for the file with the given stream from the disk
    status: 200,                                                    // STATUS 200: HTTP - Ok
    headers: new Headers({                                          // Headers
        "content-disposition": `attachment; filename=${fileName}`,  // State that this is a file attachment
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