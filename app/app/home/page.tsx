"use client"
import { IDBFile } from "@/lib/db/DBFiles"
import { useEffect, useRef, useState } from "react"
import FileTable from "./_components/file-table"
import FileInfo from "./_components/file-info"
import { FileActionsBar } from "./_components/file-actions"
import {v4 as uuidv4} from 'uuid'

interface IHomeState {
	gettingFiles: boolean
	selectedFileIdx: number
	showFileInfo: boolean
	files: IUIFile[],
	isHoldingCtrl: boolean
}

export interface IUIFile extends IDBFile {
	isBeingUploaded: boolean,
	file: File | null
}

export default function Home(): JSX.Element {
	const [state, setState] = useState<IHomeState>({
		gettingFiles: true,
		selectedFileIdx: -1,
		showFileInfo: true,
		files: [],
		isHoldingCtrl: false
	})

	useEffect(() => {
		fetchFiles()
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				state.selectedFileIdx === -1
			}
		})
	}, [])
	
	const retrieveFiles = async(): Promise<IUIFile[]> => {
		const js = await fetch("/api/files").then(resp => resp.json())
		const files: IUIFile[] = js.files as IUIFile[]
		return files
	}

	const fetchFiles = () => {
		setState(prev => ({ ...prev, gettingFiles: true }))
		fetch("/api/files")
			.then(resp => resp.json())
			.then(js => {
				const newJS = js.files as IUIFile[]
				for(let i = 0; i < js.files.length; i++) {
					newJS[i].isBeingUploaded = false,
					newJS[i].file = null
				}
				setState(prev => ({
					...prev,
					files: js.files
				}))
			}).finally(() => {
				setState(prev => ({...prev, gettingFiles: false}))
			})
	}

	const setSelected = (index: number) => {
		if(state.files[index].isBeingUploaded || index === state.selectedFileIdx) {
			return
		}

		setState(prev => ({
			...prev,
			selectedFileIdx: index
		}))
		
		refreshFileInfo(index)
	}

	const refreshFileInfo = async (index: number) => {
		let stateFiles = state.files

		const selectedFile = stateFiles[index]
		const newFile = await fetch(`/api/files/${selectedFile.ID}`)
			.then(file => file.json())
			.catch(err => {
				console.log(err.message)
				return undefined
			})

		if(newFile !== undefined) {
			stateFiles[index] = newFile
		}
		
		setState(prev => ({ ...prev, files: stateFiles }))	
	}

	const addFile = (file: File) => {
		const splitFilename = file.name.split('.') || ""
		const extension = `.${splitFilename.pop()}` || ""
		const filename = splitFilename.splice(0,file.name.length-1).join(".")

		const newFile: IUIFile = {
			DESCRIPTION: "",
			EXTENSION: extension,
			ID: uuidv4(),
			NAME: filename,
			FILENAME: file.name,
			SIZE_BYTES: file.size,
			UPLOAD_TIME: new Date(Date.now()),
			LAST_DOWNLOAD_TIME: undefined,
			LAST_DOWNLOAD_USER_ID: undefined,
			IS_OWNER: false,

			isBeingUploaded: true,
			file: file
		}
		
		setState(prev => ({
			...prev,
			files: [newFile].concat(prev.files)
		}))
	}

	const setFileUploaded = (index: number) => {
		let newFiles = state.files
		newFiles[index].isBeingUploaded = false;

		setState(prev => ({
			...prev, files: newFiles
		}))
	}

	const deleteFile = async() => {
		let file = state.files[state.selectedFileIdx]

		let URL = `/api/files/${file.ID}${file.IS_OWNER ? "" : "/unshare"}`
		let method = file.IS_OWNER ? "DELETE" : "POST"
		await fetch(URL, { method: method })

		refreshFiles()
	}

	const refreshFiles = async() => {
		let updatedFiles = await retrieveFiles()
		let modifiedFiles: IUIFile[] = []
		let currentFiles = Array.from(state.files)

		while(currentFiles.length > 0) {
			let currentFile = currentFiles[0]
			currentFiles = currentFiles.slice(1)

			if(currentFile?.isBeingUploaded) {
				modifiedFiles.push(currentFile)
			} else {
				const f = updatedFiles[0]
				updatedFiles = updatedFiles.slice(1)

				if(f !== undefined) {
					modifiedFiles.push(f)
				}
			}
		}

		if(updatedFiles.length > 0) {
			modifiedFiles = modifiedFiles.concat(updatedFiles)
		}

		setState(prev => ({
			...prev,
			files: modifiedFiles
		}))
	}

	const setFileID = (index: number, ID: string) => {
		let files = state.files
		files[index].ID = ID
		setState(prev => ({
			...prev,
			files: files
		}))
	}

	return (
		<div className={`main-container ${state.showFileInfo ? "" : "gap-0"}`}>
			<div className="table">
				<div className="table-header">
					<h1 className="text-3xl font-semibold">My Files</h1>
					<FileActionsBar 
						file={state.files[state.selectedFileIdx]}
						refreshFiles={refreshFiles}
						files={state.files}
						addFile={addFile} 
						deleteFile={deleteFile}/>
				</div>
				<div className="table-body">
					<div className="file-grid__row-header">
						<div className="file-grid__col-1">Name</div>
						<div className="file-grid__col-2">Owner</div>
						<div className="file-grid__col-3">Uploaded</div>
						<div className="file-grid__col-4">File Size</div>
						<div className="file-grid__col-5"></div>
					</div>
					<FileTable 
						selectedFileIdx={state.selectedFileIdx} 
						setSelected={setSelected} 
						refreshFileInfo={refreshFileInfo}
						files={state.files} 
						infoShown={state.showFileInfo}
						setFileUploaded={setFileUploaded}
						setFileID={setFileID}
						/>
				</div>
			</div>
			<div className={`file-info ${state.showFileInfo ? "" : "width-0"}`}>
				<FileInfo
					file={state.files[state.selectedFileIdx]}
					refreshInfo={() => refreshFileInfo(state.selectedFileIdx)}
				/>
			</div>
		</div>
	)
}