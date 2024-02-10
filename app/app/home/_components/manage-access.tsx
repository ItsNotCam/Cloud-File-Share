import React, { useState } from "react"

export default function ManageAccess(props: { close: () => void, shareFile: (username: string) => void }): JSX.Element {
	const [username, setUsername] = useState<string>("")

	return (
		<div className="manage-access">
			<div>
				<input type="text" 
					placeholder="Username" 
					name="username" 
					value={username} 
					onChange={(e) => setUsername(e.target.value)}
				/>
        <button onClick={() => props.shareFile(username)}>Send</button>
				<button onClick={props.close}>cancel</button>
			</div>
		</div>
	)
}