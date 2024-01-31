"use server"

import { IDBUser } from "@/lib/db/DBUser"
import { authenticate } from "@/lib/db/util"
import { redirect } from "next/navigation"

export default async function Home() {
	const user: IDBUser | undefined = await authenticate()
	redirect(user === undefined ? "/login" : "/home")
}