import React, { useState } from "react"
import { IUIFile } from "../page"
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from "@mui/material"

export default function ManageAccess(props: {
	close: () => void,
	file: IUIFile,
	shareFile: (username: string) => void,
	unshareFile: (username: string) => void,
	sharedUsers: string[]
}): JSX.Element {
	const [username, setUsername] = useState<string>("")

	const filteredUsers = props.sharedUsers.filter(user => props.file.OWNER_USERNAME !== user)

	return (
		<div className="darken-background">
			<div className="manage-access">
				<h1>Share "{props.file.NAME}"</h1>
				<div className="share-with">
					<input type="text"
						placeholder="Username"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<IconButton style={{ marginLeft: "0.5rem" }} onClick={() => props.shareFile(username)}>
						<SendIcon htmlColor="#121212" />
					</IconButton>
				</div>
				<div className="owners">
					<p className="font-semibold">
						({filteredUsers.length})
						{filteredUsers.length > 1 ? " Users" : " User"} with access
					</p>
					<ul className="owners">
						{filteredUsers.map(user => (
							<li>
								<p>
									{user}
									<span>{user === props.file.OWNER_USERNAME ? "(you)" : ""}</span>
								</p>
								<button 
									className="access-revoke" 
									disabled={user === props.file.OWNER_USERNAME}
									onClick={() => props.unshareFile(user)}
								>
									Revoke
								</button>
							</li>
						))}
					</ul>
				</div>
				<div className="manage-done-button">
					<button onClick={props.close}>Done</button>
				</div>
			</div>
		</div>
	)
}