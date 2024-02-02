"use client"

import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/navigation"

export default function DeleteFileButton(props: { FILE_ID: string, IS_OWNER: boolean }): JSX.Element {
	const router = useRouter()

	const deleteFile = () => {
		if(!props.IS_OWNER) {
			fetch(`/api/files/${props.FILE_ID}/unshare`, {
				method: "POST",
			}).then((resp) => {
				router.refresh()
			})
		} else {
			fetch(`/api/files/${props.FILE_ID}`, {
				method: "DELETE"
			}).then(() => {
				router.refresh()
			})
		}
	}

	return (
		<button onClick={deleteFile}><DeleteIcon /></button>
	)
}