import { NextRequest } from "next/server";

export default abstract class Logger {
  static async LogReq(request: NextRequest): Promise<void> {
    const { url, cookies, nextUrl, ip, method } = request

    Logger.Log(`${method} => ${url}`)
  }
  
  static LogErr(message: string): void {
    const date: Date = new Date(Date.now())
    console.log(`❌ ${date.toTimeString()} | ${message}`)
  }

  static LogMsg = (message: string): void => Logger.Log(message)
  
  private static Log(message: string): void {
    const date: Date = new Date(Date.now())
    console.log(`✅ ${date.toDateString()} ${date.toTimeString()} | ${message}`)
  }
} 

