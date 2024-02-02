import './_file-table.css'

import { IDBFile } from "@/lib/db/DBFiles";
import { FileActions } from "./file-actions";
import FileIcon from './file-icon';
import { calcFileSize, toDateString } from '@/lib/util';
import React, { useEffect, useState } from 'react';

interface IFileTableProps {
	setSelected: (index: number) => void,
	refreshFileInfo: (index: number) => void,
	files: IDBFile[],
	selectedFileIdx: number,
}

export default function FileTable(props: IFileTableProps): React.ReactNode {
	let {
		setSelected,
		refreshFileInfo,
		files,
		selectedFileIdx
	} = props;

	const [editingFilename, setEditingFilename] = useState<boolean>(false)
	const [filename, setFilename] = useState<string>("")
	
	useEffect(() => {
		setEditingFilename(false);
	}, [selectedFileIdx])

	const tryEditFilename = (index: number) => {
		if (selectedFileIdx === index && !editingFilename) {
			setEditingFilename(true)
			setFilename(files[index].NAME)
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if(event.keyCode === 13) {
			updateFilename()
		}
	}

	const updateFilename = (index?: number) => {
		let idx = index ?? selectedFileIdx;
		const file = files[idx]
		
		setEditingFilename(false)
		if (file.NAME === filename)
			return;
		
		file.NAME = filename;
		fetch(`/api/files/${file.ID}`, {
			method: "PATCH",
			body: JSON.stringify({
				name: filename
			})
		}).then(() => {
			refreshFileInfo(idx)
		})
	}

	const getRowCSSClasses = (index: number): string => {
		let classes: string = "text-left file-table-row font-light"
		if (selectedFileIdx === index) {
			classes = classes.concat(" file-table-row-selected")
		}

		return classes
	}

	return (
		<table className="file-table">
			<thead>
				<tr className="text-left">
					<th className="w-3/5">Name</th>
					<th>Owner</th>
					<th>Uploaded</th>
					<th>File Size</th>
					<th className="w-2"></th>
				</tr>
			</thead>
			<tbody className="scrollable">
				{files.map((file, i) => (
					<tr key={file.ID} className={getRowCSSClasses(i)} onClick={() => setSelected(i)}>
						<td className="name-field">
							<FileIcon extension={file.EXTENSION} />
							<div onClick={() => tryEditFilename(i)}>
								{editingFilename && selectedFileIdx === i
									? (
										<input type="text"
											className="filename-input"
											value={filename}
											onChange={(e) => setFilename(e.target.value)}
											onBlur={() => updateFilename(i)}
											onKeyDown={handleKeyDown} 
										/>
									) : (
										<span>
											{`${file.NAME}${file.EXTENSION}`}
										</span>
									)
								}
							</div>
						</td>
						<td>{file.IS_OWNER ? "me" : "~"}</td>
						<td>{toDateString(file.UPLOAD_TIME)}</td>
						<td>{calcFileSize(file.SIZE_BYTES)}</td>
						<td className="w-2"><FileActions file={file} /></td>
					</tr>
				))}
			</tbody>
		</table>
	)
}