// import './_file-table.css'

import { IDBFile } from "@/lib/db/DBFiles";
import React, { useState } from 'react';
import FileTableRow from "./file-table-row";
import { IUploadingFile } from "../page";


interface IFileTableProps {
	setSelected: (index: number) => void,
	refreshFileInfo: (index: number) => void,
	files: IUploadingFile[],
	selectedFileIdx: number,
	infoShown: boolean,
	uploadFileRef: any
}

export default function FileTable(props: IFileTableProps): React.ReactNode {
	let {
		setSelected,
		refreshFileInfo,
		files,
		selectedFileIdx,
	} = props;

	const [uploadingFiles, setUploadingFiles] = useState<any>()
	const [filename, setFilename] = useState<string>("")

	const updateFilename = (index: number) => {
		const file = files[index]
		fetch(`/api/files/${file.ID}`, {
			method: "PATCH",
			body: JSON.stringify({ name: filename })
		}).then(() => {
			refreshFileInfo(index)
		})
	}

	return(
		<div className="file-grid">
			<div className="h-full">
				{files.map((file, index) => (
					<div onClick={() => {if(!file.isBeingUploaded)setSelected(index)}}>
						<FileTableRow 
							index={index}
							files={files}
							// uploadProgress={uploadingFiles.get(file.NAME).progress}
							isSelected={index === selectedFileIdx}
							setSelected={() => setSelected(index)}
							updateFilename={() => updateFilename(index)} 
							uploadRef={props.uploadFileRef}
						/>
					</div>
				))}
			</div>
		</div>
	)
}
