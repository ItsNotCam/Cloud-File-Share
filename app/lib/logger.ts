import { NextRequest } from "next/server";

export default abstract class Logger {
  static async LogReq(request: NextRequest): Promise<void> {
    const { url, cookies, nextUrl, ip, method } = request
		const date: Date = new Date(Date.now())

		let color = ""
		switch(method) {
			case "GET": color = "\x1b[32m"; break;
			case "POST": color = "\x1b[36m"; break;
			case "PATCH": color = "\x1b[33m"; break;
			case "DELETE": color = "\x1b[35m"; break;
		}

		console.log(`📩 ${Logger.toReadableDate(date)} | ${color}${method}\x1b[0m => ${url}`)
  }
  
  static LogErr(message: string): void {
    const date: Date = new Date(Date.now())
    console.log(`💀 \x1b[1m\x1b[31m${Logger.toReadableDate(date)} | ${message}\x1b[0m`)
  }
	
  static LogSuccess = (message: string): void => {
		const date: Date = new Date(Date.now())
		console.log(`⭐ \x1b[1m${Logger.toReadableDate(date)} | ${message}\x1b[0m`)
	}
  
  static LogMsg(message: string): void {
		const date: Date = new Date(Date.now())
		console.log(`💠 ${Logger.toReadableDate(date)} | ${message}`)
  }

	private static toReadableDate(dt: Date): string {
		const date = `${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`
		const time = `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`
		return  `${date} ${time}`
	}
} 

/*

Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"
FgGray = "\x1b[90m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
BgGray = "\x1b[100m"

*/