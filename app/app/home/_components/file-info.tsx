import { IDBFile } from "@/lib/db/DBFiles";
import FileIcon from "./file-icon";
import { calcFileSize, toDateString } from "@/lib/util";
import React, { useEffect, useState } from "react";
import ManageAccess from "./manage-access";
import { IUIFile } from "../page";


const DEFAULT_FILE: IDBFile = {
	DESCRIPTION: "",
	EXTENSION: "",
	FILENAME: "Select a file :)",
	ID: "",
	IS_OWNER: true,
	LAST_DOWNLOAD_TIME: new Date(Date.now()),
	LAST_DOWNLOAD_USER_ID: "",
	NAME: "",
	SIZE_BYTES: 0,
	UPLOAD_TIME: new Date(Date.now()),
	SHARED_USERS: [] as string[],
	PARENT_FOLDER_ID: "000000000000000000000000000000000000",
	PARENT_FOLDER_NAME: "All Files",
	OWNER_USERNAME: ""
}

const MAX_DESCRIPTION_LENGTH: number = 5000;

export default function FileInfo(props: { 
  file: IUIFile, 
  setFileInfo: (file: IUIFile, newFile: IUIFile) => void ,
	setSelectedFolder: (FOLDER_ID: string) => void
}): JSX.Element {
	let file: IUIFile = props.file === undefined ? (DEFAULT_FILE as IUIFile) : props.file
	const fileIcon: JSX.Element = FileIcon({ extension: file.EXTENSION })

	const [description, setDescription] = useState<string>(file.DESCRIPTION)
	const [managingAccess, setManagingAccess] = useState<boolean>(false)

	useEffect(() => {
		setDescription(file.DESCRIPTION)
	}, [file.DESCRIPTION])

	const getUnfocus = (e: React.FocusEvent) => {
    fetch(`/api/files/${file.ID}`, {
      method: "PATCH",
      body: JSON.stringify({
        description: description
      })
    })
    .then(resp => {
      if(resp.status === 200)
        return resp.json()
      throw {message: "Action Failed"}
    })
    .then((js) => props.setFileInfo(file, js.file))
    .catch(err => console.log(err.message))
	}

	const updateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(e.target.value.substring(0, MAX_DESCRIPTION_LENGTH).replaceAll('\'', "\""))
	}

	const fileInfo = [
		["Type", file.EXTENSION || "N/A"],
		["Size", `${calcFileSize(file.SIZE_BYTES || 0)}`],
		["Owner", file.IS_OWNER ? "me" : (file.OWNER_USERNAME || "N/A")],
		["Uploaded", file.UPLOAD_TIME ? toDateString(file.UPLOAD_TIME) : "N/A"],
	]

  const shareFile = (username: string) => {
    fetch(`/api/files/${file.ID}/share`, {
      method: "POST",
      body: JSON.stringify({ username: username })
    })
		.then(resp => {
			if (resp.status === 200)
				return resp
			throw {message: "Request failed"}
		})
		.then(resp => resp.json())
		.then(js => {
			const newFile = file
			newFile.SHARED_USERS = js.sharedUsers
			props.setFileInfo(props.file, newFile)
			console.log(js)
		}).catch(err => {
			console.log(err)
		})
  }

  const unshareFile = (username: string) => {
		console.log("Attempting to unshare file with " + username)
    fetch(`/api/files/${file.ID}/unshare`, {
      method: "DELETE",
      body: JSON.stringify({ username: username })
    })
		.then(resp => {
			if (resp.status === 200)
				return resp
			throw {message: "Failed to unshare file"}
		})
		.then(resp => resp.json())
		.then(js => {
			const newFile = file
			newFile.SHARED_USERS = js.sharedUsers
			props.setFileInfo(props.file, newFile)
			console.log(js)
		}).catch(err => {
			console.log(err)
		})
  }
	
	return (<>
		<div className="file-info-title">
			<span>{fileIcon}</span>
			<h1 className="font-semibold">
				{file.NAME}{file.EXTENSION}
			</h1>
		</div>
		<div className="horizontal-divider" />
		<div className="file-info-container ">
			{managingAccess 
        ? <ManageAccess 
						close={() => setManagingAccess(false)} 
						shareFile={(username) => shareFile(username)}
						file={file}
						sharedUsers={file.SHARED_USERS}
						unshareFile={(username) => unshareFile(username)}
					/> 
        : null
      }
			<div className={`${managingAccess ? "cursor-not-allowed" : ""}`}>
				<div className="file-info-header">
					<span className="file-info-icon">
						{fileIcon}
					</span>
					<p className="file-access-text font-semibold">Who has access</p>
					{file.IS_OWNER
						? <AccessList owners={file.SHARED_USERS || []}/>
						: <p className="font-light text-sm text-left w-5/6">
								You do not have permission to view sharing information for this item
							</p>
					}
					{file.IS_OWNER 
						? <button className="access-btn" onClick={() => setManagingAccess(true)}>
								Manage access
							</button> 
						: null
					}
				</div>
				<div className="horizontal-divider"></div>
				<h1 className="file-info-details-title font-semibold">File Details</h1>
			</div>
			<div className="file-info-details">
				<div>
					{fileInfo.map((fi, i) =>
						<p key={`fi${i}`}>
							<span className="font-semibold text-sm">{fi[0]}</span>
							<span className="text-sm">{fi[1]}</span>
						</p>
					)}
					<div className="file-info-location">
						<span className="font-semibold text-sm">Location</span>
						<button disabled onClick={() => props.setSelectedFolder(props.file.PARENT_FOLDER_ID)}>
							{props.file.PARENT_FOLDER_NAME}
						</button>
					</div>
					<div className="file-info-description">
						<span className="font-semibold text-sm">Description</span>
						<textarea
							className="text-sm"
							value={description}
							onChange={updateDescription}
							onBlur={getUnfocus}
							disabled={file.DESCRIPTION === undefined}
						/>
						<span className="text-xs">{
							description ? descLengthtoStr(description?.length) : 0
						} / 5,000
						</span>
					</div>
				</div>
			</div>
		</div>
	</>)
}

const descLengthtoStr = (l: number) => {
	if (l / 1000 >= 1) {
		const lengthToString = `000${l % 1000}`.slice(-3)
		return `${Math.floor(l / 1000)},${lengthToString}`
	} else {
		return `${l}`
	}
}

function AccessList(props: { owners: string[] }) {
	const ownersStr = props.owners.slice(1).join(", ")
	return (
		<div className="access-list">
			<p className="text-sm">Me</p>
			{ props.owners.length > 1 && <div className="vertical-line" /> }
			<p>{ownersStr}</p>
		</div>
	)
}