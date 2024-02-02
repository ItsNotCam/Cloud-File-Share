import { IDBFile } from "@/lib/db/DBFiles";
import { IconButton } from "@mui/material";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/navigation";

export function FileActions(props: { file: IDBFile }): React.ReactNode {
	return (
		<IconButton size="small">
			<MoreVertOutlinedIcon />
		</IconButton>
	)
}

export function FileActionsBar(props: { file: IDBFile, deleteFile: () => void }): React.ReactNode {
	const router = useRouter()

	const {file} = props
	if(file === undefined) {
		return ""
	}

	return (
		<div className="file-action-bar">
			<IconButton>
				<ClearIcon fontSize="small"/>
			</IconButton>
			<a href={`/api/files/${file.ID}/download`} download={file.FILENAME}>
				<span className="file-download-link">
					<IconButton>
						<DownloadIcon fontSize="small"/>
					</IconButton>
				</span>
			</a>
			<IconButton onClick={props.deleteFile}>
				<DeleteIcon fontSize="small" />
			</IconButton>
		</div>
	)
}