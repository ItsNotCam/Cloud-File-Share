"use client"
import './_login.css'

import Link from "next/link";
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Cookies from 'universal-cookie';

export default function LoginForm(): JSX.Element {
	const router = useRouter()
	const [validating, setValidating] = useState<boolean>(false);
	const [err, setErr] = useState<boolean>(false);

	async function login(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const { username, password } = event.target as unknown as {
			username: { value: string },
			password: { value: string }
		}

		const data = {
			username: username.value,
			password: password.value
		}

		setValidating(true);

		try {
			const resp = await fetch('/api/auth/login', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			})

			const js: { message: string, token: string } = await resp.json()
			if (resp.status === 200) {
				new Cookies().set("token", js.token)
				router.push('/home')
			} else {
				setErr(true);
				setTimeout(() => setErr(false), 2000)
			}
		} catch (err: any) {
			console.log(err)
			setValidating(false)
			setErr(true);
		} finally {
			router.refresh()
			setTimeout(() => {
				setValidating(false)
				setErr(false)
			}, 500)
		}
	}

	return (<>
		<div className="login-form" style={{pointerEvents: validating ? "none" : "all"}}>
			<form onSubmit={login}>
				<input className="username" type="text" name="username" placeholder="Username" required />
				<input className="password" type="password" name="password" placeholder="Password" required />
				<Link href="/register">
					<span className="hover-underline">Register</span>
				</Link>
				<input className="login-submit" type="submit" name="Login" title="Login" value="Login" />
			</form>
		</div>
	</>)
}