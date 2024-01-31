import { IDBFile } from "@/lib/db/DBFiles";
import { useEffect, useState } from "react";

export default function Share(props: { file: IDBFile, hideShareMenu: () => void }): JSX.Element {
	const [username, setUsername] = useState<string>("")

	const share = () => {
		fetch(`/api/files/${props.file.ID}/share`, {
			method: "POST",
			body: JSON.stringify({username: username})
		})

		props.hideShareMenu()
	}

	return (<div className="share-border">
		<p style={{fontSize: "1.3rem"}}>{props.file.FILENAME}</p>
		<div className="share-file">
			<input type="text" 
				value={username} 
				placeholder="username to share" 
				onChange={(e) => setUsername(e.target.value)}/>
			<br />
			<button onClick={share}>Share</button>
		</div>
	</div>)
}