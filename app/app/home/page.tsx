"use client"
import { IDBFile } from "@/lib/db/DBFiles"
import { useEffect, useState } from "react"
import FileTable from "./_components/file-table"
import FileInfo from "./_components/file-info"
import { FileActionsBar } from "./_components/file-actions"
import {v4 as uuidv4} from 'uuid'
import {useMutex} from 'react-context-mutex'
import { getFileInfo } from "@/lib/util"
import { FolderRoot } from "./_components/folders"
import { IFolderProps } from "@/lib/db/DBFiles"


const DEFAULT_FILE: IDBFile = {
	DESCRIPTION: "",
	EXTENSION: "",
	FILENAME: "Select a file :)",
	ID: "",
	IS_OWNER: true,
	LAST_DOWNLOAD_TIME: new Date(Date.now()),
	LAST_DOWNLOAD_USER_ID: "",
	NAME: "",
	SIZE_BYTES: 0,
	UPLOAD_TIME: new Date(Date.now()),
	SHARED_USERS: [] as string[],
	PARENT_FOLDER_ID: "000000000000000000000000000000000000",
	OWNER_USERNAME: ""
}


interface IHomeState {
	gettingFiles: boolean
	selectedFile: IUIFile
	selectedFolder: IFolderProps | undefined
	showFileInfo: boolean
	files: IUIFile[],
	folders: IFolderProps,
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
		selectedFile: {} as IUIFile,
		selectedFolder: undefined,
		showFileInfo: true,
		files: [] as IUIFile[],
		folders: {} as IFolderProps,
		uploadingFiles: [] as IUIFile[],
		isHoldingCtrl: false
	})

	useEffect(() => {
		fetchFiles()
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				state.selectedFile === {} as IUIFile
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
					files: js.files,
					folders: js.folders
				}))
			}).finally(() => {
				setState(prev => ({...prev, gettingFiles: false}))
			})
	}

	const setSelectedFile = (file: IUIFile) => {
		setState(prev => ({
			...prev,
			selectedFile: file
		}))
	}

	const refreshFileInfo = async (file: IUIFile) => {
		let stateFiles = state.files
		let index = state.files.indexOf(file)

		const newFile = await fetch(`/api/files/${file.ID}`)
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
			
  		const {FILENAME, EXTENSION, NAME, FILE_ID} = await getFileInfo(file)
			let newFile: IUIFile = {
				...DEFAULT_FILE,
				EXTENSION: EXTENSION,
				ID: FILE_ID,
				NAME: NAME,
				FILENAME: FILENAME,
				SIZE_BYTES: file.size,
				UPLOAD_TIME: new Date(Date.now()),
				IS_OWNER: true,
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

    refreshFiles()
	}

  const setFileInfo = (file: IUIFile, newFile: IUIFile): void => {
    const foundFileIdx = state.files.indexOf(file)
    if(foundFileIdx >= 0) {
      let stateFiles = state.files
      stateFiles[foundFileIdx] = newFile
      setState(prev => ({
        ...prev,
        files: stateFiles,
        selectedFile: state.selectedFile === file ? newFile : state.selectedFile
      }))
    }
  }

	const deleteFile = async() => {
		let URL = `/api/files/${state.selectedFile.ID}${state.selectedFile.IS_OWNER ? "" : "/unshare"}`
		let method = state.selectedFile.IS_OWNER ? "DELETE" : "POST"
		const resp = await fetch(URL, { method: method })
    const js = await resp.json()

    if(js) {
      setState(prev => ({
        ...prev,
        files: js.files
      }))
    }

		setState(prev => ({
			...prev,
			selectedFile: {} as IUIFile,
		}))
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

	const setSelectedFolder = (id: IFolderProps) => {
		setState(prev => ({
			...prev,
			selectedFolder: id
		}))
	}

	const folderName = state.selectedFolder === undefined
		? "My Files"
		: state.selectedFolder.NAME;

	return (
		<div className={`main-container ${state.showFileInfo ? "" : "gap-0"}`}>
			<FolderRoot 
				folders={state.folders} 
				selectedFolder={state.selectedFolder} 
				setSelectedFolder={setSelectedFolder}
			/>
			<div className="table">
				<div className="table-header">
					<h1 className="text-3xl font-semibold text-ellipsis w-full overflow-hidden">
						{folderName}
					</h1>
					<FileActionsBar 
						file={state.selectedFile}
						refreshFiles={refreshFiles}
						files={state.files}
						addFiles={addFiles} 
						deleteFile={deleteFile}
					/>
				</div>
				<div className="table-body">
					<FileTable 
						selectedFile={state.selectedFile} 
						setSelectedFile={setSelectedFile} 
            setFileInfo={setFileInfo}
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
					file={state.selectedFile}
					setFileInfo={setFileInfo}
				/>
			</div>
		</div>
	)
}