"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default async function Logout(): Promise<JSX.Element> {
	const router = useRouter()
	useEffect(() => {
		fetch("/api/auth/logout", {method: "POST"}).then(() => {
			router.push("/login")
			router.refresh()
		})
	}, [])

	return <h1>Logging out...</h1>
}