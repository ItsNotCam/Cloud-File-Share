import { SERVER_SOCKET } from "@/lib/constants"
import UploadForm from "@/app/home/_components/upload-form"
import { GetFiles } from "@/app/api/admin/files/route"
import { IAdminFileProps } from "@/lib/types"
import DeleteButton from "@/app/home/_components/delete-button"
import FilesContextDropdown from "./_components/Dropdown"


export default async function Home() {
	const files: IAdminFileProps[] = await GetFiles().then(f => f.files)

	return (
		<div className="container files-container">
			<br /><br />
			<UploadForm SERVER_SOCKET={SERVER_SOCKET} />
			<br /><br />

			<h1 className="h1">Files</h1>
			<table className="table table-dark table-striped table-hover table-bordered">
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Description</th>
						<th scope="col">Size</th>
						<th scope="col">Upload Time</th>
						<th scope="col">Uploader</th>
						<th scope="col">Delete</th>
					</tr>
				</thead>
				<tbody>
					<FilesContextDropdown>
						{files.map((file: IAdminFileProps) => <File {...file} key={file.FILE_ID} />)}
					</FilesContextDropdown>
				</tbody>
			</table>
		</div>
	)
}

const File = async (props: IAdminFileProps): Promise<JSX.Element> => {
	let size: string = ""

	if (props.SIZE_BYTES >= 1024) {
		size = (props.SIZE_BYTES / Math.pow(10, 6)).toFixed(2)
	} else {
		size = (props.SIZE_BYTES / Math.pow(10, 3)).toFixed(2)
	}

	const padString = (num: number): string => num.toString().padStart(2, "0")

	const timeToString = (time: Date): { dateStr: string, timeStr: string } => {
		let hourNumber: number = time.getHours();
		let timeOfDay: string = "AM"

		if (hourNumber > 12) {
			timeOfDay = "PM"
			hourNumber -= 12
		}

		let minuteNumber: number = time.getMinutes()
		let secondNumber: number = time.getSeconds()
		let timeStr: string = `${padString(hourNumber)}:${padString(minuteNumber)}:${padString(secondNumber)} ${timeOfDay}`

		return {
			dateStr: time.toDateString(),
			timeStr: timeStr
		}
	}

	const { dateStr, timeStr } = timeToString(props.UPLOAD_TIME)

	return (
		<tr>
			<td scope="row">
				<p>{props.FILENAME}</p>
				<a href={`/api/files/${props.FILE_ID}/download`} download={props.FILENAME} className="btn btn-primary">
					Download
				</a>
			</td>
			<td scope="row">{props.DESCRIPTION || ""}</td>
			<td scope="row">{size} MB</td>
			<td scope="row">
				{dateStr}
				<br />
				{timeStr}
			</td>
			<td scope="row">{props.USERNAME}</td>
			<td scope="row">
				<DeleteButton ID={props.FILE_ID} ServerSocket={SERVER_SOCKET} />
			</td>
		</tr>
	)
}
