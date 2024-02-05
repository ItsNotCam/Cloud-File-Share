"use client"
import { IDBFile } from "@/lib/db/DBFiles"
import { useEffect, useRef, useState } from "react"
import FileTable from "./_components/file-table"
import { IconButton } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileInfo from "./_components/file-info"
import { FileActionsBar } from "./_components/file-actions"

interface IHomeState {
	gettingFiles: boolean
	selectedFileIdx: number
	showFileInfo: boolean
	files: IUploadingFile[],
	isHoldingCtrl: boolean
}

export interface IUploadingFile extends IDBFile {
	isBeingUploaded: boolean,
}

export default function Home(): JSX.Element {
	const [state, setState] = useState<IHomeState>({
		gettingFiles: true,
		selectedFileIdx: -1,
		showFileInfo: true,
		files: [],
		isHoldingCtrl: false
	})

	const uploadFileRef = useRef(null)

	useEffect(() => {
		fetchFiles()
		document.addEventListener('keydown', setIsHoldingCtrl);
		document.addEventListener('keyup', setIsHoldingCtrl);
	}, [])

	const fetchFiles = () => {
		setState(prev => ({ ...prev, gettingFiles: true }))
		fetch("/api/files")
			.then(resp => resp.json())
			.then(js => {
				const newJS = js.files as IUploadingFile[]
				for(let i = 0; i < js.files.length; i++) {
					newJS[i].isBeingUploaded = false
				}
				setState(prev => ({
					...prev,
					files: js.files,
					gettingFiles: false
				}))
			})
	}

	const setSelected = (index: number) => {
		setState(prev => ({
			...prev,
			selectedFileIdx: index
		}))
		refreshFileInfo(index)
	}

	const toggleInfoShown = () => {
		setState(prev => ({
			...prev,
			showFileInfo: !prev.showFileInfo
		}))
	}

	const refreshFileInfo = async (index: number) => {
		const stateFiles = state.files
		const selectedFile = stateFiles[index]
		stateFiles[index] = await fetch(`/api/files/${selectedFile.ID}`)
			.then(file => file.json())

		setState(prev => ({ ...prev, files: stateFiles }))
	}

	const setIsHoldingCtrl = (e: KeyboardEvent) => {
		setState(prev => ({ ...prev, isHoldingCtrl: e.ctrlKey }))
	}

	const addFile = (newFile: IUploadingFile) => {
		newFile.isBeingUploaded = true
		setState(prev => ({
			...prev,
			files: [newFile].concat(prev.files)
		}))
		
	}

	return (
		<div className={`main-container ${state.showFileInfo ? "" : "gap-0"}`}>
			<div className="table">
				<div className="table-header">
					<h1 className="text-3xl font-semibold">My Files</h1>
					<FileActionsBar 
						file={state.files[state.selectedFileIdx]} 
						refreshFiles={fetchFiles} 
						files={state.files}
						addFile={addFile}
						uploadFileRef={uploadFileRef}
					/>
					{/* <IconButton onClick={toggleInfoShown}>
						<InfoOutlinedIcon fontSize="large" style={{
							color: state.showFileInfo ? "var(--color-info-dark)" : "black"
						}} />
					</IconButton> */}
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
						uploadFileRef={uploadFileRef}
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

	// return (
	// 	<div className="wrapper-horizontal">
	// 		<div className="file-list bg-default">
	// 			<div className="table-header flex flex-row justify-between align-middle">
	// 				<h1 className="text-3xl font-semibold">My Files</h1>
	// 				<IconButton onClick={toggleInfoShown}>
	// 					<InfoOutlinedIcon fontSize="large" style={{
	// 						color: state.showFileInfo ? "var(--color-info-dark)" : "black"
	// 					}}/>
	// 				</IconButton>
	// 			</div>
	// 			<FileActionsBar 
	// 				file={state.files[state.selectedFileIdx]} 
	// 				deleteFile={() => deleteFile(state.selectedFileIdx)}
	// 				updateFiles={fetchFiles}
	// 			/>
	// 			<FileTable 
	// 				selectedFileIdx={state.selectedFileIdx} 
	// 				setSelected={setSelected} 
	// 				refreshFileInfo={refreshFileInfo}
	// 				files={state.files} 
	// 			/>
	// 		</div>
	// 		<div className={`file-info bg-default ${state.showFileInfo ? "" : "width-0"}`}>
	// 			<FileInfo 
	// 				file={state.files[state.selectedFileIdx]} 
	// 				refreshInfo={() => refreshFileInfo(state.selectedFileIdx)} 
	// 			/>
	// 		</div>
	// 	</div>
	// )
}