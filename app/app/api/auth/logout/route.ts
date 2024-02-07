import DBAuth from "@/lib/db/DBAuth";
import DBUser, { IDBUser } from "@/lib/db/DBUser";
import { NextRequest, NextResponse } from "next/server";

import { cookies } from 'next/headers'
import Logger from "@/lib/logger";

export async function POST(request: NextRequest): Promise<Response> {
  Logger.LogReq(request)
	await DBAuth.LogoutUser(cookies().get("token")?.value || "")
	cookies().delete("token")
	return NextResponse.json({ status: "logged out" }, { status: 200 })
}