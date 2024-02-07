"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Logout(): JSX.Element {
	const router = useRouter()
	useEffect(() => {
		fetch("/api/auth/logout", {method: "POST"}).then(() => {
			router.push("/login")
			router.refresh()
		})
	}, [])

	return <h1>Logging out...</h1>
}