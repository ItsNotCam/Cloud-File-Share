"use client"
import Link from "next/link";
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Cookies from 'universal-cookie';

export default function RegisterForm(): JSX.Element {
	const router = useRouter()
	const [validating, setValidating] = useState<boolean>(false);

	function login(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const { username, password } = event.target as unknown as {
			username: {value: string},
			password: {value: string}
		}

		const data = {
			username: username.value,
			password: password.value
		}

		setValidating(true);

		fetch('/api/auth/register', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		})
		.then(resp => {
			if(resp.status === 200){
				return resp.json()
			} else {
				throw resp.status
			}
		})
		.then(data => {
			const cookies = new Cookies()
			cookies.set("token", data.token)
			router.push('/home')
		})
		.catch(err => {
			console.log(err)
		})
		.finally(() => {
			router.refresh()
			setValidating(false)
		})
	}

	return (<>
		<h1 className={`validating ${validating ? "show-valid" : ""}`}>
			Registering
		</h1>
		<form onSubmit={login}>
			<input className="username" type="text" name="username" placeholder="Username" required />
			<input className="password" type="password" name="password" placeholder="Password" required/>
			<Link href="/login">Login</Link>
			<input className="submit" type="submit" name="Register" title="Register" value="Register" />
		</form>
	</>)
}