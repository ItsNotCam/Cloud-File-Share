import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNextOutlined';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TableChartIcon from '@mui/icons-material/TableChart';

import ImageIcon from '@mui/icons-material/Image';

export default function FileIcon(props: {extension: string, onClick?: () => void}): JSX.Element {
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
		
		// Executables
		[".exe", <QueuePlayNextIcon style={{color: "#4285f4"}}/>],
		[".msi", <QueuePlayNextIcon style={{color: "#4285f4"}}/>],
		
		// 3D
		[".blend", <ViewInArOutlinedIcon style={{color: "darkorange"}}/>],
		[".fbx", <ViewInArOutlinedIcon />],
		[".obj", <ViewInArOutlinedIcon />],
    
    // Documents
		[".doc", <ArticleIcon style={{color: "blue"}}/>],
		[".docx", <ArticleIcon style={{color: "blue"}}/>],
		[".txt", <ArticleIcon style={{color: "blue"}}/>],

    // Data
		[".json", <DataObjectIcon style={{color: "#45BA63"}}/>],
		[".csv", <TableChartIcon style={{color: "#45BA63"}}/>],
		[".xls", <TableChartIcon style={{color: "#45BA63"}}/>],
		[".xlsx", <TableChartIcon style={{color: "#45BA63"}}/>],

    // PDF
		[".pdf", <DescriptionIcon style={{color: "#E64F40"}}/>],
	])

	const DoNothing = () => {};

	const icon = iconMap.get(props.extension)
	return icon === undefined
		? <span onClick={props.onClick || DoNothing}><InsertDriveFileOutlinedIcon/></span>
		: <span onClick={props.onClick}>{icon as JSX.Element}</span>
}