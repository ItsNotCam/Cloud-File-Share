// import './_file-table.css'

import React from 'react';
import FileTableRow from "./file-table-row";
import { IUIFile } from "../page";
import { IFolderProps } from '@/lib/db/DBFolders';


interface IFileTableProps {
	setSelectedFile: (file: IUIFile) => void,
	refreshFileInfo: (file: IUIFile) => void,
	setFileUploaded: (file: IUIFile, FILE_ID: string) => void,
	setFileID: (file: IUIFile, ID: string) => void,
	setFileInfo: (file: IUIFile, newFile: IUIFile) => void,
	files: IUIFile[],
	uploadingFiles: IUIFile[],
	selectedFile: IUIFile,
	selectedFolder: IFolderProps | undefined
}

export default function FileTable(props: IFileTableProps): React.ReactNode {
	const updateFilename = (file: IUIFile, name: string) => {
		fetch(`/api/files/${file.ID}`, {
			method: "PATCH",
			body: JSON.stringify({
				name: name
			})
		})
		.then(resp => {
			if (resp.status === 200)
			return resp.json()
		throw { message: "Updating filename failed" }
	})
	.then(js => {
			console.log(js)
			props.setFileInfo(file, js.file)
		})
		.catch(err => console.log(err.message))
	}

	const trySetSelected = (file: IUIFile) => {
		if (!file.isBeingUploaded)
			props.setSelectedFile(file)
	}

	return (<>
		<div className="file-grid__row-header">
			<div className="file-grid__col-1">Name</div>
			<div className="file-grid__col-2">Owner</div>
			<div className="file-grid__col-3">Uploaded</div>
			<div className="file-grid__col-4">File Size</div>
			<div className="file-grid__col-5"></div>
		</div>
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
								selectedFolder={props.selectedFolder}
							/>
						</div>
					)) : null
				}

				{ // show no files yet text
					props.files?.length < 1 && props.uploadingFiles?.length < 1
						? <div className="flex w-full h-full justify-center mt-8">
							<h1 className="text-md">No Files Yet</h1>
						</div>
						: null
				}

				{props.files?.length > 0
					? props.files.map(file => (
						<div key={file.ID} onClick={() => trySetSelected(file)}>
							<FileTableRow
								file={file}
								selectedFolder={props.selectedFolder}
								isSelected={props.selectedFile?.ID === file?.ID}
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
	</>)
}
