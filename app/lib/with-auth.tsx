import { authenticate } from "@/lib/db/util"
import { redirect } from "next/navigation"

export default async function WithAuth(props: { children: any }): Promise<JSX.Element> {
	const user = await authenticate()
	if (user === undefined) {
		redirect("/login")
	}
	return props.children
}