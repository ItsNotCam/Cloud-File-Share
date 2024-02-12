import './_context-menu.css'
import DownloadIcon from '@mui/icons-material/Download';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IUIFile } from '../page';
import { useEffect, useState } from 'react';

interface IContextMenuProps {
	selectedFile: IUIFile
	rename: (newName: string) => void
	duplicate: () => void
	share: () => void
	trash: () => void
	delete: () => void
}

export default function ContextMenu(props: IContextMenuProps): JSX.Element {
	const [isRenaming, setIsRenaming] = useState<boolean>(false);
	const [newFilename, setNewFilename] = useState<string>(props.selectedFile.NAME);
	const [mouseOut, setMouseOut] = useState<boolean>(false);

	useEffect(() => {
		setNewFilename(props.selectedFile.NAME)
	}, [props.selectedFile, isRenaming])

	const tryDisableRename = () => {
		if(mouseOut) {
			setIsRenaming(false)
		}
	}

	const rename = () => {
		props.rename(newFilename)
		setIsRenaming(false)
	}

	const onMouseIn = () => setMouseOut(false)
	const onMouseOut = () => setMouseOut(true)

	return (<>
		{isRenaming && (
			<div className="context-rename-wrapper" onClick={tryDisableRename}>
				<div className="context-rename" onMouseEnter={onMouseIn} onMouseLeave={onMouseOut}>
					<h1>Rename &quot;{props.selectedFile.NAME}&quot;</h1>
					<input type="text" 
						placeholder={props.selectedFile.NAME} 
						value={newFilename} 
						onChange={(e) => setNewFilename(e.target.value)}
					/>
					<div className="context-rename-actions">
						<button 
							className="context-cancel" 
							onClick={() => setIsRenaming(false)}>
							Cancel
						</button>

						<button 
							className="context-apply" 
							onClick={rename}>
							Apply
						</button>
					</div>
				</div>
			</div>
		)}
		<div className="context-wrapper">
			<a className="context-row" 
				href={`/api/files/${props.selectedFile.ID}/download`} 
				download={`${props.selectedFile.NAME}${props.selectedFile.EXTENSION}`}
			>
				<DownloadIcon fontSize="small" color="inherit"/>
				Download
			</a>
			<div className="context-row" onClick={() => setIsRenaming(true)}>
				<BorderColorIcon fontSize="small" color="inherit"/>
				Rename
			</div>
			<div className="context-row" onClick={props.duplicate}>
				<ContentCopyIcon fontSize="small" color="inherit"/>
				Duplicate
			</div>
			<div className="border" />
			<div className="context-row" onClick={props.share}>
				<PersonAddOutlinedIcon fontSize="small" color="inherit"/>
				Manage Access
			</div>
			<div className="border" />
			<div className="context-row" onClick={props.delete}>
				<DeleteOutlineOutlinedIcon fontSize="small" color="inherit"/>
				Delete
			</div>
		</div>
	</>)
}