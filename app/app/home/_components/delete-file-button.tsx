"use client"

import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/navigation"

export default function DeleteFileButton(props: { FILE_ID: string }): JSX.Element {
	const router = useRouter()

	const deleteFile = () => {
		fetch(`/api/files/${props.FILE_ID}`, {
			method: "DELETE"
		}).then(() => {
			router.refresh()
		})
	}

	return (
		<button onClick={deleteFile}><DeleteIcon /></button>
	)
}