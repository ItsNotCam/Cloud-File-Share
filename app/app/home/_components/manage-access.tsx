import React, { ChangeEvent, useState } from "react"

export default function ManageAccess(props: { close: () => void }): JSX.Element {
	const [username, setUsername] = useState<string>("")

	const handleChange = (e: any) => {
		setUsername(e.target.value)
	}

	return (
		<div className="manage-access">
			{/* <form>
				<input type="text" placeholder="Username" />
				<input type="submit">Send</input>
			</form> */}
			<div>
				<input type="text" 
					placeholder="Username" 
					name="username" 
					value={username} 
					onChange={(e) => setUsername(e.target.value)}
				/>
				<button onClick={props.close}>cancel</button>
			</div>
		</div>
	)
}