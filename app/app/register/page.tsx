import { authenticate } from "@/lib/db/util";
import RegisterForm from "./_form";
import { redirect } from "next/navigation";

export default async function Register(): Promise<JSX.Element> {
	const user = await authenticate()
	if(user !== undefined) {
		redirect("/home")
	}
	
	return (
		<div className="main-container">
			<div className="login-container">
				<h1>Register</h1>
				<p>Please enter a username and password</p>
				<RegisterForm />
			</div>
		</div>
		)
}
