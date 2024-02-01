import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNextOutlined';
import FolderZipIcon from '@mui/icons-material/FolderZip';

import ImageIcon from '@mui/icons-material/Image';

export default function FileIcon(props: {extension: string}): JSX.Element {
	const iconMap = new Map([
		// archives
		[".7z", <FolderZipIcon style={{color: "#737373"}} />],
		[".zip", <FolderZipIcon style={{color: "#737373"}} />],
		[".tar", <FolderZipIcon style={{color: "#737373"}} />],
		[".gz", <FolderZipIcon style={{color: "#737373"}} />],

		// images
		[".png", <ImageIcon style={{color: "#d93025"}}/>],
		[".jpg", <ImageIcon style={{color: "#d93025"}}/>],
		[".jpeg", <ImageIcon style={{color: "#d93025"}}/>],
		[".bmp", <ImageIcon style={{color: "#d93025"}}/>],
		[".gif", <ImageIcon style={{color: "#d93025"}}/>],
		[".tiff", <ImageIcon style={{color: "#d93025"}}/>],
		[".psd", <ImageIcon style={{color: "#d93025"}}/>],
		
		// executables
		[".exe", <QueuePlayNextIcon style={{color: "#4285f4"}}/>],
		[".msi", <QueuePlayNextIcon style={{color: "#4285f4"}}/>],
		
		// 3D
		[".blend", <ViewInArOutlinedIcon style={{color: "darkorange"}}/>],
		[".fbx", <ViewInArOutlinedIcon />],
		[".obj", <ViewInArOutlinedIcon />],
	])

	const icon = iconMap.get(props.extension)
	return icon === undefined
		? <InsertDriveFileOutlinedIcon />
		: iconMap.get(props.extension) as JSX.Element
}