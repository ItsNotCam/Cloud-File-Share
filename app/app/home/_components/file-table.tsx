import './_file-table.css'

import { IDBFile } from "@/lib/db/DBFiles";
import { FileActions } from "./file-actions";
import FileIcon from './file-icon';
import { calcFileSize, toDateString } from '@/lib/util';
import React, { useEffect, useRef, useState } from 'react';

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
	const textInputRef = useRef(null)
	
	useEffect(() => {
		setEditingFilename(false);
	}, [selectedFileIdx])

	useEffect(() => {
		document.addEventListener("keydown", (event) => {
			if(event.key === "Escape") {
				resetFilename()
			}
		});
	}, [])

	const tryEditFilename = (index: number) => {
		if (selectedFileIdx === index && !editingFilename) {
			setFilename(files[index].NAME)
			setEditingFilename(true);
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if(event.key === "Enter") {
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

	const resetFilename = (index?: number) => {
		setEditingFilename(false)
		
		const file = files[index ?? selectedFileIdx]
		if(file !== undefined) {
			console.log(file)
			setFilename(file.NAME)
		}
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
					<th className='file-table-1'>Owner</th>
					<th className='file-table-2'>Uploaded</th>
					<th className='file-table-3'>File Size</th>
					<th className="w-2"></th>
				</tr>
			</thead>
			<tbody>
				{files.map((file, i) => (
					<tr key={file.ID} className={getRowCSSClasses(i)} onClick={() => setSelected(i)}>
						<td className={`name-field ${i === selectedFileIdx ? "cursor-text" : ""}`}>
							<FileIcon extension={file.EXTENSION} />
							<div onClick={() => tryEditFilename(i)}>
								<input type="text"
									className="filename-input"
									value={filename}
									onChange={(e) => setFilename(e.target.value)}
									onBlur={() => resetFilename(i)}
									ref={textInputRef}
									style={{display: editingFilename && selectedFileIdx === i ? "block" : "none"}}	
									onKeyDown={handleKeyDown}
								/>
								<span style={{display: editingFilename && selectedFileIdx === i ? "none" : "block"}}>
									{`${file.NAME}${file.EXTENSION}`}
								</span>
							</div>
						</td>
						<td className="text-left">{file.IS_OWNER ? "me" : "~"}</td>
						<td className="text-left">{toDateString(file.UPLOAD_TIME)}</td>
						<td className="text-left">{calcFileSize(file.SIZE_BYTES)}</td>
						<td><FileActions file={file} /></td>
					</tr>
				))}
			</tbody>
		</table>
	)
}