"use client"

import ClearIcon from '@mui/icons-material/Clear';


import React, { useRef, useState } from "react"
import axios, { AxiosError, AxiosProgressEvent } from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './upload-form.css'

import { useRouter } from "next/navigation";
import Progress from './progress';

interface ValidationErrors {
	errors: string[]
}

interface IUploadFormProps {
	file: File | null
	uploadingProgress: number
	isUploading: boolean
	DESCRIPTION: string
}

export default function UploadForm(): JSX.Element {
	const router = useRouter()
	const [state, setState] = useState<IUploadFormProps>({
		file: null,
		uploadingProgress: 0,
		isUploading: false,
		DESCRIPTION: ""
	})
	const inputFile = useRef(null);

	const handleFormChange = (event: any) => {
		const newValue: string | File = event.target.name == "file"
			? event.target.files?.[0]
			: event.target.value

		setState(prev => ({
			...prev,
			[event.target.name]: newValue
		}))
	}

	const handleProgressUpdate = (event: AxiosProgressEvent) => {
		const progress: number = event.loaded / (event.total || 9999999) * 100
		console.log(progress)
		setState(prev => ({
			...prev,
			uploadingProgress: progress
		}))
	}

	const uploadFile = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!state.file) {
			alert("failed to upload - no file was present")
			return
		}

		const data: FormData = new FormData()
		data.set('file', state.file)
		data.set('filesize', state.file.size.toString())
		data.set('description', state.DESCRIPTION)

		setState({ ...state, isUploading: true })
		axios.post(`/api/files/upload`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
			onUploadProgress: handleProgressUpdate
		}).catch((e: AxiosError) => {
			alert(`Failed to upload file\n${e.message}\n${e.response?.data}`)
		}).finally(() => {
			resetFile()
			router.refresh()
			setState(prev => ({
				...prev,
				DESCRIPTION: "",
				isUploading: false,
				uploadingProgress: 0
			}))
		})
	}

	const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		await axios.post(`/api/users/create`, {
			headers: { 'Content-Type': 'application/json' },
		}).then(_ => {
			setState(prev => ({ ...prev, USERNAME: "", PASSWORD: "", DESCRIPTION: ""}))
		}).catch(err => {
			const axiosErr: AxiosError = err as AxiosError
			const { errors }: ValidationErrors = axiosErr.response?.data as ValidationErrors
			alert(errors.join(" - "))
		}).finally(() => {
			resetFile()
		})
	}

	const resetFile = () => {
		if (inputFile.current) {
			inputFile.current.value = ""; //ignore
		}

		setState({ ...state, file: null })
	};

	return (
		<div className="upload-form">
			<h1 className="h1">Upload File</h1>
			<form onSubmit={(event) => uploadFile(event)}>
				<div className="file-section">
					<button className="clear-file" onClick={resetFile} disabled={state.file === null || state.isUploading}>
						<ClearIcon />
					</button>
					<input
						type="file"
						name="file"
						onChange={handleFormChange}
						ref={inputFile}
						required
						disabled={state.isUploading}
					/>
					<input type="submit" value="Upload" disabled={state.file === null || state.isUploading} />
				</div>
				<input type="text" name="DESCRIPTION" placeholder="description" value={state.DESCRIPTION} onChange={handleFormChange}/>
			</form>
			<Progress progress={state.uploadingProgress} />
			{/* {state.isUploading && <><br /><ProgressBar now={state.uploadingProgress} /></>} */}
		</div>
	)
}