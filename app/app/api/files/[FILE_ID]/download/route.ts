// DOWNLOAD FILE
"use server"
import fs, { Stats } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { ReadableOptions } from 'stream'
import { cookies } from 'next/headers'
import Logger from '@/lib/logger'
import DBFile from '@/lib/db/DBFiles'


async function DownloadFile(request: NextRequest, context: { params: any }, response: Response): Promise<NextResponse> {
  Logger.LogReq(request)
  const { FILE_ID } = context.params;
	const token = cookies().get("token")?.value
  
	try {
    const info = await DBFile.GetFileForDownload(FILE_ID, {token: token});
    if(info === undefined) {
      throw {message: "file does not exist"}
    }
    const {FILENAME, INTERNAL_FILE_PATH} = info
    const data: ReadableStream<Uint8Array> = streamFile(INTERNAL_FILE_PATH);
    const stats: Stats = await fs.promises.stat(INTERNAL_FILE_PATH); 

		Logger.LogSuccess(`Sending file: ${FILE_ID}`)
		return new NextResponse(data, {                                   // Create a new NextResponse for the file with the given stream from the disk
			status: 200,                                                    // STATUS 200: HTTP - Ok
			headers: new Headers({                                          // Headers
					"content-disposition": `attachment; filename=${FILENAME}`,  // State that this is a file attachment
					"content-type": "application/iso",                          // Set the file type to an iso
					"content-length": `${stats.size}`                           // State the file size
			}),
		});
	} catch (err: any) {
		Logger.LogErr("Sending file failed: " + err.message)
	}

	return NextResponse.json({ message: "failed to upload" }, { status: 500 })
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