import { IDBFile } from "@/lib/db/DBFiles";
import FileIcon from "./file-icon";
import { calcFileSize, toDateString } from "@/lib/util";
import React, { useEffect, useState } from "react";
import ManageAccess from "./manage-access";

import {v4 as uuidv4} from 'uuid'

const defaultFile: IDBFile = {
	DESCRIPTION: "",
	EXTENSION: "",
	FILENAME: "Select a file :)",
	ID: "",
	IS_OWNER: true,
	LAST_DOWNLOAD_TIME: new Date(),
	LAST_DOWNLOAD_USER_ID: "",
	NAME: "",
	SIZE_BYTES: 0,
	UPLOAD_TIME: new Date(),
	SHARED_USERS: [],
	OWNER_USERNAME: ""
}

const MAX_DESCRIPTION_LENGTH: number = 5000;

export default function FileInfo(props: { file: IDBFile, refreshInfo: () => void }): JSX.Element {
	let file: IDBFile = props.file === undefined ? defaultFile : props.file
	const fileIcon: JSX.Element = FileIcon({ extension: file.EXTENSION })

	const [description, setDescription] = useState<string>(file.DESCRIPTION)
	const [name, setName] = useState<string>(file.NAME)
	const [managingAccess, setManagingAccess] = useState<boolean>(false)

	const getUnfocus = (e: React.FocusEvent) => {
		if (description !== file.DESCRIPTION) {
			fetch(`/api/files/${file.ID}`, {
				method: "PATCH",
				body: JSON.stringify({
					description: description
				})
			}).then(() => props.refreshInfo())
		}

		if (name !== file.NAME) {
			console.log("ok")
			fetch(`/api/files/${file.ID}`, {
				method: "PATCH",
				body: JSON.stringify({
					name: name
				})
			}).then(() => props.refreshInfo())
		}
	}

	const updateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(e.target.value.substring(0, MAX_DESCRIPTION_LENGTH))
	}

	const fileInfo = [
		["Type", file.EXTENSION || "none"],
		["Size", `${calcFileSize(file.SIZE_BYTES)}`],
		["Owner", file.IS_OWNER ? "me" : file.OWNER_USERNAME],
		["Uploaded", toDateString(file.UPLOAD_TIME)]
	]

	useEffect(() => {
		setDescription(file.DESCRIPTION)
	}, [file.DESCRIPTION])

	useEffect(() => {
		setName(file.NAME)
	}, [file.NAME])

  const shareFile = (username: string) => {
    const data = {
      username: username
    }

    fetch(`/api/files/${file.ID}/share`, {
      method: "POST",
      body: JSON.stringify(data)
    }).then(resp => console.log(resp))
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
						: <p className="font-light text-sm text-left w-5/6 mb-5">
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
					<div className="file-info-description">
						<span className="font-semibold text-sm">Description</span>
						<textarea
							className="text-sm"
							value={description}
							onChange={updateDescription}
							onBlur={getUnfocus}
						/>
						<span className="text-xs">{descLengthtoStr(description?.length)} / 5,000</span>
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
			<div className="vertical-line" />
			<p>{ownersStr}</p>
		</div>
	)
}