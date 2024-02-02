"use client"
import { IDBFile } from "@/lib/db/DBFiles"
import { useEffect, useState } from "react"
import FileTable from "./_components/file-table"
import { IconButton } from "@mui/material"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileInfo from "./_components/file-info"
import { FileActionsBar } from "./_components/file-actions"

interface IHomeState {
	gettingFiles: boolean
	selectedFileIdx: number
	showFileInfo: boolean
	files: IDBFile[],
	isHoldingCtrl: boolean
}

export default function Home(): JSX.Element {
	const [state, setState] = useState<IHomeState>({
		gettingFiles: true,
		selectedFileIdx : -1,
		showFileInfo: true,
		files: [],
		isHoldingCtrl: false
	})

  useEffect(() => {
		fetchFiles()
    document.addEventListener('keydown', setIsHoldingCtrl);
    document.addEventListener('keyup', setIsHoldingCtrl);
  }, [])

	const fetchFiles = () => {
    setState(prev => ({
      ...prev,
      gettingFiles: true
    }))

		fetch("/api/files")
			.then(resp => resp.json())
			.then(js => {
				setState(prev => ({
					...prev,
					files: js.files,
					gettingFiles: false
				}))
			})
	}

	const deleteFile = (index: number) => {
		const file = state.files[index]
		if(!file.IS_OWNER) {
			fetch(`/api/files/${file.ID}/unshare`, {
				method: "POST",
			}).then(() => fetchFiles())
		} else {
			fetch(`/api/files/${file.ID}`, {
				method: "DELETE"
			}).then(() => fetchFiles())
		}
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

	const refreshFileInfo = async(index: number) => {
		const stateFiles = state.files
		const selectedFile = stateFiles[index]
		stateFiles[index] = await fetch(`/api/files/${selectedFile.ID}`)
			.then(file => file.json())

		setState(prev => ({
			...prev,
			files: stateFiles
		}))
	}

	const setIsHoldingCtrl = (e: KeyboardEvent) => {
		setState(prev => ({
			...prev,
			isHoldingCtrl: e.ctrlKey
		}))
	}

	return (
		<div className="wrapper-horizontal">
			<div className="file-list bg-default">
				<div className="flex flex-row justify-between align-middle">
					<h1 className="text-4xl font-semibold">My Files</h1>
					<IconButton onClick={toggleInfoShown}>
						<InfoOutlinedIcon fontSize="large" style={{
							color: state.showFileInfo ? "var(--color-info-dark)" : "black"
						}}/>
					</IconButton>
				</div>
				<FileActionsBar 
					file={state.files[state.selectedFileIdx]} 
					deleteFile={() => deleteFile(state.selectedFileIdx)}
					updateFiles={fetchFiles}
				/>
				<FileTable 
					selectedFileIdx={state.selectedFileIdx} 
					setSelected={setSelected} 
					refreshFileInfo={refreshFileInfo}
					files={state.files} 
				/>
			</div>
			<div className={`file-info bg-default ${state.showFileInfo ? "" : "width-0"}`}>
				<FileInfo 
					file={state.files[state.selectedFileIdx]} 
					refreshInfo={() => refreshFileInfo(state.selectedFileIdx)} 
				/>
			</div>
		</div>
	)
}