import FileIcon from "./file-icon"
import { useEffect, useState } from "react"
import { calcFileSize, toDateString } from '@/lib/util';
import { FileActions } from "./file-actions";
import { IUIFile } from "../page";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import Logger from "@/lib/logger";

export interface IFileTablRowProps {
	file: IUIFile,
	isSelected: boolean,
	activeUpload?: boolean,
	updateFilename: (filename: string) => void,
	setSelected: () => void,
	setFileUploaded: (FILE_ID: string) => void,
	setFileID: (ID: string) => void
}

export default function FileTableRow(props: IFileTablRowProps) {
	const [filename, setFilename] = useState<string>("")
	const [editingFilename, setEditingFilename] = useState<boolean>(false)
	const [isUploading, setIsUploading] = useState<boolean>(false)
	const [uploadProgress, setUploadProgress] = useState<number>(0)

	
	// initialize an AbortController instance
	const abortController = new AbortController()

	// on enter, if this is a file that is marked as being one to upload, do it
	useEffect(() => {
		if(props.activeUpload && props.file?.file != null) {
			setIsUploading(true)
			uploadFile(props.file.file)
		}
	}, [])

	useEffect(() => {
		setEditingFilename(false)
		setFilename(props.file.NAME)
	}, [props.isSelected, props.file.NAME])


	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			setEditingFilename(false)

      if(props.file.NAME !== filename)
			  props.updateFilename(filename)
		}
	}

	const tryEditFilename = () => {
		if (props.isSelected && !isUploading) {
			setEditingFilename(true)
		}
	}

	const handleProgressUpdate = (event: AxiosProgressEvent) => {
		setUploadProgress(event.loaded / (event.total || 9999999) * 100)
	}

	const uploadFile = (file: File | null) => {
		if(!file) {
			return
		}

		const data: FormData = new FormData()
		data.set('file', file)

		axios.post(`/api/files/upload`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
			signal: abortController.signal,
			onUploadProgress: handleProgressUpdate
		}).then(resp => {
			props.setFileUploaded(resp.data.ID)
		}).catch((e: AxiosError) => {
			Logger.LogErr(`Failed to upload file\n${e.message}\n${e.response?.data}`)
		}).finally(() => {
			setIsUploading(false)
		})
	}

	return (
		<div className={`file-grid__row 
			${props.isSelected && !props.file.isBeingUploaded 
				? "file-grid__row-selected" 
				: ""
			} ${isUploading 
				? "cursor-not-allowed" 
				: ""}`
			}
			onClick={() => {if (!isUploading ) props.setSelected()}}>
			{isUploading
				? <div className="uploading-bar">
					<div className="uploading-bar-progress" id="uploading-bar" style={{ width: `${uploadProgress}%` }} />
				</div>
				: null
			}
			<div className="file-grid__col-1 cursor-default">
				<FileIcon extension={props.file.EXTENSION} onClick={() => {
					if (isUploading) {
						setEditingFilename(false)
					}
				}} />
				<div className={`${props.isSelected ? "cursor-text w-full" : ""}`}>
					{editingFilename && props.isSelected && !isUploading
						? <input type="text"
							className="filename-input"
							value={filename}
							onChange={(e) => setFilename(e.target.value)}
							onBlur={() => setFilename(props.file.NAME)}
							onKeyDown={handleKeyDown}
						/>
						: <span style={{ display: editingFilename && props.isSelected ? "none" : "block" }} onClick={() => tryEditFilename()}>
							{`${filename}${props.file.EXTENSION}`}
						</span>
					}
				</div>
			</div>
			<div className="file-grid__col-2" 
				onClick={() => setEditingFilename(false)}
			>
				{props.file.IS_OWNER ? "me" : props.file.OWNER_USERNAME}
			</div>
			<div className="file-grid__col-3" 
				onClick={() => setEditingFilename(false)}
			>
				{toDateString(props.file.UPLOAD_TIME)}
			</div>
			<div className="file-grid__col-4" 
				onClick={() => setEditingFilename(false)}
			>
				{calcFileSize(props.file.SIZE_BYTES)}
			</div>
			<div className="file-grid__col-5" 
				onClick={() => setEditingFilename(false)} 
				style={{pointerEvents: isUploading ? "none" : "all"}}
			>
				<FileActions file={props.file} />
			</div>
		</div>
	)
}