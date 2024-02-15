import RegisterForm from "./_form";
import WithoutAuth from "@/lib/without-auth";

export default async function Register(): Promise<JSX.Element> {
	return (
		<WithoutAuth>
			<div className="centered-container full-height-width">
				<div className="login-container">
					<h1>Register</h1>
					<p>Please enter a username and password</p>
					<RegisterForm />
				</div>
			</div>
		</WithoutAuth>
	)
}
