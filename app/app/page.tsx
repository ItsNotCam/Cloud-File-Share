"use server"

import DBAuth from "@/lib/db/DBAuth"
import { IDBUser } from "@/lib/db/DBUser"
import { redirect } from "next/navigation"

export default async function Home() {
	const user: IDBUser | undefined = await DBAuth.Authenticate()
	redirect(user === undefined ? "/login" : "/home")
}