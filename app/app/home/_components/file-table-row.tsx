import FileIcon from "./file-icon"
import { useEffect, useState } from "react"
import { calcFileSize, toDateString } from '@/lib/util';
import { FileActions } from "./file-actions";
import { IUIFile } from "../page";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import Logger from "@/lib/logger";

import { IconButton } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IFolderProps } from "@/lib/db/DBFiles";

export interface IFileTablRowProps {
	file: IUIFile,
	selectedFolder: IFolderProps | undefined,
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
		if (props.activeUpload && props.file?.file != null) {
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
			updateFilenameAndHideInput()
		}
	}

	const updateFilenameAndHideInput = () => {
		if (props.file.NAME !== filename)
			props.updateFilename(filename)

		setEditingFilename(false)
	}

	const resetFilename = () => {
		setFilename(props.file.NAME)
		setEditingFilename(false)
	}

	const tryEditFilename = () => {
		if (props.isSelected && !isUploading) {
			setEditingFilename(true)
		}
	}

	const trySetEditingFilename = () => {
		if (isUploading) {
			setEditingFilename(false)
		}
	}

	const trySetSelected = () => {
		if (!isUploading)
			props.setSelected()
	}

	const handleProgressUpdate = (event: AxiosProgressEvent) => {
		setUploadProgress(event.loaded / (event.total || 9999999) * 100)
	}

	const uploadFile = (file: File | null) => {
		if (!file) {
			return
		}

		const data: FormData = new FormData()
		data.set('file', file)

		let folderName = ""
		if(props.selectedFolder && props.selectedFolder.ID !== "ALL_FILES") {
			folderName = props.selectedFolder.ID
		}
		data.set('folder', folderName)

		axios.post(`/api/files/upload`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
			signal: abortController.signal,
			onUploadProgress: handleProgressUpdate
		})
			.then(resp => {
				props.setFileUploaded(resp.data.ID)
			}).catch((e: AxiosError) => {
				Logger.LogErr(`Failed to upload file\n${e.message}\n${e.response?.data}`)
			}).finally(() => {
				setIsUploading(false)
			})
	}

	const onContextMenu = (e: any) => {
		e.preventDefault()
		props.setSelected()
	}


	let fileGridRowClasses = ""
	if (props.isSelected && !props.file.isBeingUploaded)
		fileGridRowClasses = " file-grid__row-selected"
	if (isUploading)
		fileGridRowClasses += " cursor-not-allowed"

	return (
		<div className={`file-grid__row ${fileGridRowClasses}`}
			onClick={trySetSelected}
			onContextMenu={onContextMenu}
			draggable={!editingFilename}
		>
			{isUploading
				? <div className="uploading-bar">
					<div 
						className={`uploading-bar-progress ${uploadProgress > 99.9999 ? "uploading-bar-progress__pending" : ""} `} 
						id="uploading-bar" 
						style={{ width: `${uploadProgress}%` }} 
					/>
				</div>
				: null
			}
			<div className="file-grid__col-1 cursor-default">
				<FileIcon extension={props.file.EXTENSION} onClick={trySetEditingFilename} />
				<div className={`${props.isSelected ? "cursor-text w-full" : ""}`}>
					{editingFilename && props.isSelected && !isUploading
						? (
							<div className="file-name-edit-group">
								<input type="text"
									className="filename-input"
									value={filename}
									onChange={(e) => setFilename(
										e.target.value.substring(0, 64).replaceAll("\'", "\"")
									)}
									onKeyDown={handleKeyDown}
								/>
								<IconButton size="small" onClick={resetFilename}>
									<CloseIcon fontSize="small" />
								</IconButton>
								<IconButton size="small" onClick={updateFilenameAndHideInput}>
									<CheckIcon fontSize="small" />
								</IconButton>
							</div>
						) : (
							<span style={{ display: editingFilename && props.isSelected ? "none" : "block" }} onClick={() => tryEditFilename()}>
								{`${filename}${props.file.EXTENSION}`}
							</span>
						)
					}
				</div>
			</div>
			<div className="file-grid__col-2">
				{props.file.IS_OWNER ? "me" : props.file.OWNER_USERNAME}
			</div>
			<div className="file-grid__col-3">
				{toDateString(props.file.UPLOAD_TIME)}
			</div>
			<div className="file-grid__col-4">
				{calcFileSize(props.file.SIZE_BYTES)}
			</div>
			<div className="file-grid__col-5" style={{ pointerEvents: isUploading ? "none" : "all" }}>
				<FileActions file={props.file} />
			</div>
		</div>
	)
}