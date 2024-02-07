import { redirect } from "next/navigation"
import DBAuth from "./db/DBAuth"

export default async function WithoutAuth(props: { children: any }): Promise<JSX.Element> {
	const user = await DBAuth.Authenticate()
	if(user !== undefined) {
		redirect("/home")
	}

	return props.children
}