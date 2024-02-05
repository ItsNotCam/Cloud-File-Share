import FileIcon from "./file-icon"
import { useEffect, useRef, useState } from "react"
import { calcFileSize, toDateString } from '@/lib/util';
import { FileActions } from "./file-actions";
import { IUploadingFile } from "../page";

export interface IFileTablRowProps {
	index: number,
	files: IUploadingFile[],
	isSelected: boolean,
	isBeingUploaded?: boolean,
	uploadRef: any,
	updateFilename: (filename: string) => void,
	setSelected: () => void
}

export default function FileTableRow(props: IFileTablRowProps) {
	var {index, files, isSelected, updateFilename, setSelected, isBeingUploaded} = props
	const file = files[index]

	const [filename, setFilename] = useState<string>("")
	const [editingFilename, setEditingFilename] = useState<boolean>(false)

	const textInputRef = useRef(null)

	useEffect(() => {
		setFilename(file.NAME)
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				setFilename(file.NAME)
			}
		});
	}, [])

	useEffect(() => {
		setEditingFilename(false)
		setFilename(file.NAME)
	}, [isSelected])

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			setFilename(filename)
			updateFilename(filename)
			setEditingFilename(false)
		}
	}

	const tryEditFilename = () => {
		if(isSelected && !file.isBeingUploaded) {
			setEditingFilename(true)
		}
	}

	return (
		<div className={`file-grid__row ${isSelected && !file.isBeingUploaded ? "file-grid__row-selected" : ""}`} 
			onClick={() => {
					if(!file.isBeingUploaded)
						setSelected
				}}>
				{file.isBeingUploaded 
					? <div className="uploading-bar">
							<div className="uploading-bar-progress" id="uploading-bar" style={{width: 0}}/>
						</div>
					: null
				}
			
			<div className="file-grid__col-1 cursor-default"> 
				<FileIcon extension={file.EXTENSION} onClick={() => {
					if(file.isBeingUploaded){
						setEditingFilename(false)
					}
				}}/>
				<div className={`${isSelected ? "cursor-text w-full" : ""}`}>
					{editingFilename && isSelected && !file.isBeingUploaded
						?<input type="text"
						className="filename-input"
						value={filename}
						onChange={(e) => setFilename(e.target.value)}
						onBlur={() => setFilename(file.NAME)}
						ref={textInputRef}
						onKeyDown={handleKeyDown}
					/> 
					: <span style={{ display: editingFilename && isSelected ? "none" : "block" }} onClick={() => tryEditFilename()}>
							{`${file.NAME}${file.EXTENSION}`}
						</span>
					}
				</div>
			</div>
			<div className="file-grid__col-2" onClick={() => setEditingFilename(false)}>{file.IS_OWNER ? "me" : "~"}</div>
			<div className="file-grid__col-3" onClick={() => setEditingFilename(false)}>{toDateString(file.UPLOAD_TIME)}</div>
			<div className="file-grid__col-4" onClick={() => setEditingFilename(false)}>{calcFileSize(file.SIZE_BYTES)}</div>
			<div className="file-grid__col-5" onClick={() => setEditingFilename(false)}><FileActions file={file}/></div>
		</div>
	)
}