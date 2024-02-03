import { IDBFile } from "@/lib/db/DBFiles";
import { IconButton } from "@mui/material";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/navigation";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { FormEvent, useEffect, useRef, useState } from "react";
import axios, { AxiosError, AxiosProgressEvent } from "axios";

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
	file: IDBFile, 
	deleteFile: () => void, 
	updateFiles: () => void 
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
			(inputFile.current as any).focus()
		} catch {
			alert("failed to open input dialog")
		}
	}

	const handleProgressUpdate = (event: AxiosProgressEvent) => {
		const progress: number = event.loaded / (event.total || 9999999) * 100
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

		const files: File[] = (inputFile.current as any).files
		if(files.length < 1) {
			alert("failed to upload - no file was present")
			return
		}

		const data: FormData = new FormData()
		data.set('file', files[0])

		setState({ ...state, isUploading: true })
		axios.post(`/api/files/upload`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
			onUploadProgress: handleProgressUpdate
		}).catch((e: AxiosError) => {
			alert(`Failed to upload file\n${e.message}\n${e.response?.data}`)
		}).finally(() => {
			setState(prev => ({
				...prev,
				isUploading: false,
				uploadProgress: 0
			}))

			props.updateFiles()
			resetFile()
		})
	}
	
	const resetFile = () => {
		if (inputFile.current) {
			(inputFile.current as any).value = "";
		}
	};

	return (
		<div className="file-action-wrapper">
			<div className="file-action-bar">
				{
					file === undefined 
						? ""
						: (<>
							<a href={`/api/files/${file.ID}/download`} download={file.FILENAME}>
								<span className="file-download-link">
									<IconButton>
										<DownloadIcon fontSize="small"/>
									</IconButton>
								</span>
							</a>
							<IconButton onClick={props.deleteFile}>
								<DeleteIcon fontSize="small" />
							</IconButton>
					</>)
				}
				<label htmlFor="files" className="file-upload" style={{color: "gray"}}>
					<IconButton onClick={openUploadDialog} title="Upload File" >
						<CloudUploadIcon fontSize="small"/>
					</IconButton>
				</label>
				<input 
					id="files" 
					style={{visibility: "hidden"}} 
					type="file" 
					ref={inputFile} 
					onChange={uploadFile}
				/>
			</div>
			<LoadingBar progress={state.uploadProgress} />
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