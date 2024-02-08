import { IDBFile } from "@/lib/db/DBFiles";
import { IconButton } from "@mui/material";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useRef } from "react";
import { IUIFile } from "../page";

export function FileActions(props: { file: IDBFile }): React.ReactNode {
	return (
		<IconButton size="small">
			<MoreVertOutlinedIcon />
		</IconButton>
	)
}

interface IFileActionsBarProps { 
	file: IUIFile, 
	files: IUIFile[],
	refreshFiles: () => void,
	addFiles: (file: File[]) => void
	deleteFile: () => void,
}

export function FileActionsBar(props: IFileActionsBarProps): React.ReactNode {
	const {file} = props
	const inputFile = useRef(null) 

	const openUploadDialog = () => {
		try {
			(inputFile.current as any).click()
		} catch {
			alert("failed to open input dialog")
		}
	}

	const uploadFile = (event: React.ChangeEvent) => {
		event.preventDefault()
		
		if (!inputFile || !inputFile.current) {
			alert("failed to upload - no file was present")
			return
		}

		const files: File[] = (inputFile.current as {files: File[]}).files
		if(files.length < 1) {
			alert("failed to upload - no file was present")
			return
		}

		props.addFiles(files)
	}
	
	return (
		<div className="file-action-wrapper">
			{
				file === undefined 
					? ""
					: (<>
						<a href={`/api/files/${file.ID}/download`} download={file.FILENAME}>
							<span className="file-download-link">
								<IconButton>
									<DownloadIcon fontSize="large" />
								</IconButton>
							</span>
						</a>
						<IconButton onClick={props.deleteFile}>
							<DeleteIcon fontSize="large"  />
						</IconButton>
				</>)
			}
			<label htmlFor="files" className="file-upload">
				<IconButton onClick={openUploadDialog} title="Upload File" >
					<CloudUploadIcon fontSize="large" />
				</IconButton>
			</label>
			<input 
				id="files" 
				multiple
				style={{visibility: "hidden", display: "none"}} 
				type="file" 
				ref={inputFile} 
				onChange={uploadFile}
			/>
		</div>
	)
}

const LoadingBar = (props: {progress: number}): JSX.Element => {
	return (
		<div className="progress-wrapper">
			<div className="progress" style={{width: `${props.progress}%`, opacity: props.progress === 0 ? 0 : 1}} />
		</div>
	)
}