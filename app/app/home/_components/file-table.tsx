import { IDBFile } from "@/lib/db/DBFiles";

import DownloadIcon from '@mui/icons-material/Download';
import DeleteFileButton from "./delete-file-button";

export default function FileTable(props: { files: IDBFile[] }): JSX.Element {
	const { files } = props;
	return (
		<table>
			<thead>
				<tr>
					<th style={{textAlign: "center"}}>DL</th>
					<th>Filename</th>
					<th>Description</th>
					<th>Size (MB)</th>
					<th>Owner?</th>
					<th style={{textAlign: "center"}}>DEL</th>
				</tr>
			</thead>
			<tbody>
				{files.map(file => (
					<tr key={file.ID}>
						<td style={{textAlign: "center"}}>
							<a href={`/api/files/${file.ID}/download`} download={file.FILENAME}>
								<span className="file-download-link">
									<DownloadIcon color={"inherit"}/>
								</span>
							</a>
						</td>
						<td>
							{file.FILENAME}
						</td>
						<td>{file.DESCRIPTION}</td>
						<td>{file.SIZE_BYTES / Math.pow(10,6)}</td>
						<td style={{backgroundColor: file.IS_OWNER ? "#172b1a" : "#2e1616"}}>{file.IS_OWNER ? "Yes" : "No"}</td>
						<td style={{textAlign: "center"}}>
							{file.IS_OWNER ? <DeleteFileButton FILE_ID={file.ID}/> : ""}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}