import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNextOutlined';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TableChartIcon from '@mui/icons-material/TableChart';
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';

import ImageIcon from '@mui/icons-material/Image';

import {v4 as uuidv4} from 'uuid'

export default function FileIcon(props: {extension: string, onClick?: () => void}): JSX.Element {
	const iconMap = new Map([
		// archives
		[".7z", <FolderZipIcon key={uuidv4()}style={{color: "#737373"}} />],
		[".zip", <FolderZipIcon key={uuidv4()}style={{color: "#737373"}} />],
		[".tar", <FolderZipIcon key={uuidv4()}style={{color: "#737373"}} />],
		[".gz", <FolderZipIcon key={uuidv4()}style={{color: "#737373"}} />],

		// images
		[".png", <ImageIcon key={uuidv4()}style={{color: "#d93025"}}/>],
		[".jpg", <ImageIcon key={uuidv4()}style={{color: "#d93025"}}/>],
		[".jpeg", <ImageIcon key={uuidv4()}style={{color: "#d93025"}}/>],
		[".bmp", <ImageIcon key={uuidv4()}style={{color: "#d93025"}}/>],
		[".gif", <ImageIcon key={uuidv4()}style={{color: "#d93025"}}/>],
		[".tiff", <ImageIcon key={uuidv4()}style={{color: "#d93025"}}/>],
		[".psd", <ImageIcon key={uuidv4()}style={{color: "#d93025"}}/>],
		
		// Executables
		[".exe", <QueuePlayNextIcon key={uuidv4()}style={{color: "#4285f4"}}/>],
		[".msi", <QueuePlayNextIcon key={uuidv4()}style={{color: "#4285f4"}}/>],
		
		// 3D
		[".blend", <ViewInArOutlinedIcon key={uuidv4()}style={{color: "darkorange"}}/>],
		[".fbx", <ViewInArOutlinedIcon key={uuidv4()}/>],
		[".obj", <ViewInArOutlinedIcon key={uuidv4()}/>],
    
    // Documents
		[".doc", <ArticleIcon key={uuidv4()}style={{color: "blue"}}/>],
		[".docx", <ArticleIcon key={uuidv4()}style={{color: "blue"}}/>],
		[".txt", <ArticleIcon key={uuidv4()}style={{color: "blue"}}/>],

    // Data
		[".json", <DataObjectIcon key={uuidv4()}style={{color: "#45BA63"}}/>],
		[".csv", <TableChartIcon key={uuidv4()}style={{color: "#45BA63"}}/>],
		[".xls", <TableChartIcon key={uuidv4()}style={{color: "#45BA63"}}/>],
		[".xlsx", <TableChartIcon key={uuidv4()}style={{color: "#45BA63"}}/>],

    // PDF
		[".pdf", <DescriptionIcon key={uuidv4()}style={{color: "#E64F40"}}/>],

		// Audio
		[".mp3", <AudioFileOutlinedIcon key={uuidv4()}style={{color: "black"}} />],
		[".wav", <AudioFileOutlinedIcon key={uuidv4()}style={{color: "black"}} />],
		[".ogg", <AudioFileOutlinedIcon key={uuidv4()}style={{color: "black"}} />],

		// Video
		[".mp4", <OndemandVideoOutlinedIcon key={uuidv4()}style={{color: "black"}} />],
		[".ffmpeg", <OndemandVideoOutlinedIcon key={uuidv4()}style={{color: "black"}} />],
		[".mov", <OndemandVideoOutlinedIcon key={uuidv4()}style={{color: "black"}} />],
		[".avi", <OndemandVideoOutlinedIcon key={uuidv4()}style={{color: "black"}} />],
		[".wmv", <OndemandVideoOutlinedIcon key={uuidv4()}style={{color: "black"}} />],
		[".webm", <OndemandVideoOutlinedIcon key={uuidv4()}style={{color: "black"}} />],
	])

	const DoNothing = () => {};

	const icon = iconMap.get(props.extension)
	return icon === undefined
		? <span onClick={props.onClick || DoNothing}><InsertDriveFileOutlinedIcon/></span>
		: <span onClick={props.onClick}>{icon as JSX.Element}</span>
}