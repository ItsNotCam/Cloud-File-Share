// import './_file-table.css'

import React from 'react';
import FileTableRow from "./file-table-row";
import { IUIFile } from "../page";


interface IFileTableProps {
	setSelectedFile: (file: IUIFile) => void,
	refreshFileInfo: (file: IUIFile) => void,
	setFileUploaded: (file: IUIFile, FILE_ID: string) => void,
	setFileID: (file: IUIFile, ID: string) => void,
	files: IUIFile[],
	uploadingFiles: IUIFile[],
	selectedFile: IUIFile,
}

export default function FileTable(props: IFileTableProps): React.ReactNode {
	const updateFilename = (file: IUIFile, name: string) => {
		fetch(`/api/files/${file.ID}`, {
			method: "PATCH",
			body: JSON.stringify({ name: name })
		}).then(() => {
			props.refreshFileInfo(file)
		})
	}

	const trySetSelected = (file: IUIFile) => {
		if(!file.isBeingUploaded)
			props.setSelectedFile(file)
	}

	return(
		<div className="file-grid">
			<div className="h-full">
				{props.uploadingFiles.length > 0
					? props.uploadingFiles.map((file, index) => (
						<div key={file.ID} onClick={() => trySetSelected(file)}>
							<FileTableRow 
								file={file}
								isSelected={props.selectedFile.ID === file.ID}
								setSelected={() => props.setSelectedFile(file)}
								updateFilename={(filename) => updateFilename(file, filename)} 
								activeUpload={file.isBeingUploaded} 
								setFileUploaded={(FILE_ID) => props.setFileUploaded(file, FILE_ID)}
								setFileID={(ID) => props.setFileID(file, ID)}
							/>
						</div>
					)) : null
				}

				{ // show no files yet text
					props.files.length < 1 && props.uploadingFiles.length < 1 
						? "No Files Yet" 
						: null
				}

				{props.files.length > 0
					? props.files.map((file, index) => (
						<div key={file.ID} onClick={() => trySetSelected(file)}>
							<FileTableRow 
								file={file}
								isSelected={props.selectedFile.ID === file.ID}
								setSelected={() => props.setSelectedFile(file)}
								updateFilename={(filename) => updateFilename(file, filename)} 
								activeUpload={file.isBeingUploaded} 
								setFileUploaded={(FILE_ID) => props.setFileUploaded(file, FILE_ID)}
								setFileID={(ID) => props.setFileID(file, ID)}
								/>
						</div>
					)) : null
				}
			</div>
		</div>
	)
}
