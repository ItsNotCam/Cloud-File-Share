import './file-table.css'

import { IDBFile } from "@/lib/db/DBFiles";
import {FileActions} from "./file-actions";
import FileIcon from './file-icon';
import { calcFileSize, toDateString } from '@/lib/util';

export default function FileTable(props: {
	setSelected: (index: number) => void,
	files: IDBFile[],
	selectedFileIdx: number
}): React.ReactNode {
	const {setSelected, files, selectedFileIdx} = props;

	return (
		<table className="file-table">
			<thead>
				<tr className="text-center">
					<th className="text-left w-3/5">Name</th>
					<th>Owner</th>
					<th>Uploaded</th>
					<th className="text-left">File Size</th>
					<th className="w-2"></th>
				</tr>
			</thead>
			<tbody className="scrollable">
				{files.map((file, i) => (
					<tr key={file.ID} className={`text-center file-table-row font-light ${selectedFileIdx === i ? "file-table-row-selected" : ""}`} onClick={() => setSelected(i)}>
						<td className="text-left w-3/5 font-medium">
							<FileIcon extension={file.EXTENSION} />
							<span style={{marginLeft: "1rem"}}>{file.FILENAME}</span>
						</td>
						<td>{file.IS_OWNER ? "me" : "someone else"}</td>
						<td>{toDateString(file.UPLOAD_TIME)}</td>
						<td className="text-left">{calcFileSize(file.SIZE_BYTES)}</td>
						<td className="w-2"><FileActions file={file}/></td>
					</tr>
				))}
			</tbody>
		</table>
	)
}