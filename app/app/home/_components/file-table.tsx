// import './_file-table.css'

import { IDBFile } from "@/lib/db/DBFiles";
import React, { useState } from 'react';
import FileTableRow from "./file-table-row";
import { IUIFile } from "../page";


interface IFileTableProps {
	setSelected: (index: number) => void,
	refreshFileInfo: (index: number) => void,
	setFileUploaded: (file: IUIFile) => void,
	setFileID: (index: number, ID: string) => void,
	files: IUIFile[],
	selectedFileIdx: number,
	infoShown: boolean,
}

export default function FileTable(props: IFileTableProps): React.ReactNode {
	const updateFilename = (index: number, name: string) => {
		const file = props.files[index]
		fetch(`/api/files/${file.ID}`, {
			method: "PATCH",
			body: JSON.stringify({ name: name })
		}).then(() => {
			props.refreshFileInfo(index)
		})
	}

	return(
		<div className="file-grid">
			<div className="h-full">
				{props.files.length < 1 
					? "No files yet :)" 
					: props.files.map((file, index) => (
					<div key={file.ID} onClick={() => {if(!file.isBeingUploaded)props.setSelected(index)}}>
						<FileTableRow 
							file={file}
							isSelected={index === props.selectedFileIdx}
							setSelected={() => props.setSelected(index)}
							updateFilename={(filename) => updateFilename(index, filename)} 
							activeUpload={file.isBeingUploaded} 
							setFileUploaded={() => props.setFileUploaded(file)}
							setFileID={(ID) => props.setFileID(index, ID)}
						/>
					</div>
				))
				}
			</div>
		</div>
	)
}
