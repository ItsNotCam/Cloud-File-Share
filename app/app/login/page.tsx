import { authenticate } from "@/lib/db/util";
import LoginForm from "./_form";
import { redirect } from "next/navigation";

export default async function Login(): Promise<JSX.Element> {
	const user = await authenticate()
	if(user !== undefined) {
		redirect("/home")
	}
	
	return (
		<div className="main-container full-height-width">
			<div className="login-container">
				<h1>Login</h1>
				<p>Please enter your username and password</p>
				<LoginForm />
			</div>
		</div>
		)
}
