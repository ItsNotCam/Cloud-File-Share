import LogoutButton from "./_components/logout"
import DBAuth from "@/lib/db/DBAuth"
import { IDBUser } from "@/lib/db/DBUser"
import { cookies } from "next/headers"

export default async function Header(): Promise<JSX.Element> {
	const token = cookies().get("token")?.value
	let username: string = "User"
	if(token !== undefined) {
		const user: IDBUser | undefined = await DBAuth.GetUserFromToken(token)
		if(user !== undefined) {
			username = user.USERNAME;
		}
	}

	return (
		<header>
			<nav className="bg-default">
				<h1>😊 
					<span className="font-light">Welcome, </span> 
					<span className="font-semibold">{` ${username}`}</span>
				</h1>
				<LogoutButton />
			</nav>
		</header>
	)
}