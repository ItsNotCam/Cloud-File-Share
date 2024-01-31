import { IDBFile } from "@/lib/db/DBFiles";

export default function FileTable(props: { files: IDBFile[] }): JSX.Element {
	const { files } = props;
	return (
		<table>
			<thead>
				<tr>
					<th>Filename</th>
					<th>Description</th>
					<th>Size (MB)</th>
					<th>Owner?</th>
				</tr>
			</thead>
			<tbody>
				{files.map(file => (
					<tr key={file.ID}>
						<td>{file.FILENAME}</td>
						<td>{file.DESCRIPTION}</td>
						<td>{file.SIZE_BYTES / Math.pow(10,6)}</td>
						<td style={{backgroundColor: file.IS_OWNER ? "#172b1a" : "#2e1616"}}>{file.IS_OWNER ? "Yes" : "No"}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}