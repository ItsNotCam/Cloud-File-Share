import { authenticate } from "@/lib/db/util"
import { redirect } from "next/navigation"
import Logger from "./logger"

export default async function WithAuth(props: { children: any }): Promise<JSX.Element> {
	const user = await authenticate()
	if (user === undefined) {
		Logger.LogErr("User attempted to log in without credentials - redirecting")
		redirect("/login")
	}
	return props.children
}