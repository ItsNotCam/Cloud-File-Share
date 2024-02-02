"use client"

import { useRouter } from "next/navigation"

export default function Header(): JSX.Element {
	const router = useRouter()
	const logout = () => {
		fetch("/api/auth/logout", {method: "POST"}).then(() => {
			router.push("/login")
			router.refresh()
		})
	}

	return (
		<button className="logout-button" onClick={logout}>Logout</button>
	)
}