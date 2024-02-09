"use client"
import { IDBFile } from "@/lib/db/DBFiles"
import { useEffect, useState } from "react"
import FileTable from "./_components/file-table"
import FileInfo from "./_components/file-info"
import { FileActionsBar } from "./_components/file-actions"
import {v4 as uuidv4} from 'uuid'
import {useMutex} from 'react-context-mutex'
import { getFileInfo } from "@/lib/util"

interface IHomeState {
	gettingFiles: boolean
	selectedFileIdx: number
	showFileInfo: boolean
	files: IUIFile[],
	uploadingFiles: IUIFile[],
	isHoldingCtrl: boolean
}
 
export interface IUIFile extends IDBFile {
	isBeingUploaded: boolean,
	file: File | null
}

export default function Home(): JSX.Element {
	const MutexRunner = useMutex();
	const mutex = new MutexRunner(uuidv4());

	const [state, setState] = useState<IHomeState>({
		gettingFiles: true,
		selectedFileIdx: -1,
		showFileInfo: true,
		files: [],
		uploadingFiles: [],
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

	const setSelected = (file: IUIFile) => {
		let index = state.files.indexOf(file)
		if(state.files[index].isBeingUploaded || index === state.selectedFileIdx) {
			return
		}

		setState(prev => ({
			...prev,
			selectedFileIdx: index
		}))
		
		refreshFileInfo(file)
	}

	const refreshFileInfo = async (file: IUIFile) => {
		let stateFiles = state.files
		let index = state.files.indexOf(file)

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

	const addFiles = async(filesToAdd: File[]) => {
		let newFiles: IUIFile[] = []
		for(let i = 0; i < filesToAdd.length; i++) {
			let file = filesToAdd[i]
			
  		const {FILENAME, EXTENSION, NAME} = await getFileInfo(file)
			const newFile: IUIFile = {
				DESCRIPTION: "",
				EXTENSION: EXTENSION,
				ID: uuidv4(),
				NAME: NAME,
				FILENAME: FILENAME,
				SIZE_BYTES: file.size,
				UPLOAD_TIME: new Date(Date.now()),
				LAST_DOWNLOAD_TIME: undefined,
				LAST_DOWNLOAD_USER_ID: undefined,
				IS_OWNER: true,
				SHARED_USERS: [],
				OWNER_USERNAME: "",
				
				isBeingUploaded: true,
				file: file
			}

			newFiles.push(newFile)
		}
		
		mutex.run(async () => {
			try {
				mutex.lock();
				setState(prev => ({
					...prev,
					uploadingFiles: prev.uploadingFiles.concat(newFiles)
				}))
			} catch (e) {
				console.log(e)
			} finally {
				mutex.unlock()
			}
		});
	}

	const setFileUploaded = (file: IUIFile, FILE_ID: string) => {
		let newUploadingFiles: IUIFile[] = state.uploadingFiles
		newUploadingFiles.splice(newUploadingFiles.indexOf(file), 1)
		file.isBeingUploaded = false;
		file.file = null
		file.ID = FILE_ID

		setState(prev => ({
			...prev, 
			uploadingFiles: newUploadingFiles,
			files: [file].concat(prev.files)
		}))
	}

	const deleteFile = async() => {
		const file = state.files[state.selectedFileIdx]
		let URL = `/api/files/${file.ID}${file.IS_OWNER ? "" : "/unshare"}`
		let method = file.IS_OWNER ? "DELETE" : "POST"
		await fetch(URL, { method: method })
		refreshFiles()
	}

	const refreshFiles = async() => {
		let updatedFiles = await retrieveFiles()

		mutex.run(async () => {
			try {
				mutex.lock();
				setState(prev => ({
					...prev,
					files: updatedFiles
				}))
			} catch (e) {
				console.log(e)
			} finally {
				mutex.unlock()
			}
		});
	}

	const setFileID = (file: IUIFile, ID: string) => {
		let files = state.uploadingFiles
		files[files.indexOf(file)].ID = ID
		setState(prev => ({
			...prev,
			uploadingFiles: files
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
						addFiles={addFiles} 
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
						uploadingFiles={state.uploadingFiles}
						setFileUploaded={setFileUploaded}
						setFileID={setFileID}
						/>
				</div>
			</div>
			<div className={`file-info ${state.showFileInfo ? "" : "width-0"}`}>
				<FileInfo
					file={state.files[state.selectedFileIdx]}
					refreshInfo={() => refreshFileInfo(state.files[state.selectedFileIdx])}
				/>
			</div>
		</div>
	)
}