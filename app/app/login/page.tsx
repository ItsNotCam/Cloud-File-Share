import './_login.css'

import LoginForm from "./_form";
import WithoutAuth from '@/lib/without-auth';

export default async function Login(): Promise<JSX.Element> {
	return (
		<WithoutAuth>
			<div className="centered-container full-height-width">
				<div className="login-container">
					<h1>Login</h1>
					<p>Please enter your username and password</p>
					<LoginForm />
				</div>
			</div>
		</WithoutAuth>
		)
}
