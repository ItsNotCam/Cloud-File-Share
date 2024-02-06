import { IDBFile } from "@/lib/db/DBFiles";
import { IconButton } from "@mui/material";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useEffect, useRef, useState } from "react";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import { IFile } from "../page";

export function FileActions(props: { file: IDBFile }): React.ReactNode {
	return (
		<IconButton size="small">
			<MoreVertOutlinedIcon />
		</IconButton>
	)
}

interface IFileActionsBarState {
	uploadProgress: number,
	isUploading: boolean
}

interface IFileActionsBarProps { 
	file: IFile, 
	files: IFile[],
	refreshFiles: () => void,
	addFile: (file: File) => void
	deleteFile: () => void
}

export function FileActionsBar(props: IFileActionsBarProps): React.ReactNode {
	const {file} = props
	const inputFile = useRef(null) 

	const [state, setState] = useState<IFileActionsBarState>({
		uploadProgress: 0,
		isUploading: false
	})

	const openUploadDialog = () => {
		try {
			(inputFile.current as any).click()
		} catch {
			alert("failed to open input dialog")
		}
	}

	const handleProgressUpdate = (event: AxiosProgressEvent) => {
		var ubr = document.getElementById("uploading-bar")
		const progress: number = event.loaded / (event.total || 9999999) * 100
		if(ubr) {
			ubr.style.width = `${progress}%`
		}

		setState(prev => ({
			...prev,
			uploadProgress: progress
		}))
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

		props.addFile(files[0])

		// setState({ ...state, isUploading: true })
		// axios.post(`/api/files/upload`, data, {
		// 	headers: { 'Content-Type': 'multipart/form-data' },
		// 	onUploadProgress: handleProgressUpdate
		// }).catch((e: AxiosError) => {
		// 	alert(`Failed to upload file\n${e.message}\n${e.response?.data}`)
		// }).finally(() => {
		// 	setState(prev => ({
		// 		...prev,
		// 		isUploading: false,
		// 		uploadProgress: 0
		// 	}))

		// 	props.refreshFiles()
		// 	resetFile()
		// })
	}
	
	const resetFile = () => {
		if (inputFile.current) {
			(inputFile.current as any).value = "";
		}
	};

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