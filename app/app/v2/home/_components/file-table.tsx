"use client"
import { IDBFile } from "@/lib/db/DBFiles";

import DownloadIcon from '@mui/icons-material/Download';
import DeleteFileButton from "./delete-file-button";
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShareIcon from '@mui/icons-material/Share';
import Share from "./share-file";
import React, { useState } from "react";

export default function FileTable(props: { files: IDBFile[] }): JSX.Element {
	const [showShareMenu, setShowShareMenu] = useState<boolean>(false)
	const [filetoShare, setFileToShare] = useState<IDBFile | undefined>(undefined)
	const [page, setPage] = useState<number>(0)
	const [selectedIdx, setSelectedIdx] = useState<number>(0)

	const { files } = props;

	const itemsPerPage = 10;
	const pageStartIdx = page * itemsPerPage;
	const pageEndIdx = pageStartIdx + itemsPerPage;
	const totalPages = Math.ceil(files.length / itemsPerPage)

	const showShare = (file: IDBFile) => {
		setFileToShare(file)
		setShowShareMenu(true)
	}

	const nextPage = () => {
		setPage(prev => Math.min(prev + 1, Math.floor(files.length / itemsPerPage)))
	}

	const prevPage = () => {
		setPage(prev => Math.max(0, prev - 1))
	}
	
	const selectedFile = selectedIdx === -1 ? undefined : files[selectedIdx]
	let sFileName = selectedFile?.FILENAME;
	if(sFileName !== undefined && sFileName.length >= 25) {
		sFileName = `${selectedFile?.FILENAME.substring(0, 27)}...`
	}

	return (<>
		{
			showShareMenu && filetoShare !== undefined
				? <Share file={filetoShare} hideShareMenu={() => setShowShareMenu(false)} />
				: ""
		}
		<div className="file-info-container">
			<h1><strong>{sFileName}</strong></h1>
			<div className="file-info">
				<div className="file-data">
					<p><strong>ID:</strong> {selectedFile?.ID}</p>
					<p><strong>Name:</strong> {selectedFile?.NAME}</p>
					<p><strong>Extension:</strong> {selectedFile?.EXTENSION}</p>
					<p><strong>Description:</strong> {selectedFile?.DESCRIPTION}</p>
					<p><strong>Size </strong>(bytes): {selectedFile?.SIZE_BYTES}</p>
					<p><strong>Uploaded </strong>Time: {selectedFile?.UPLOAD_TIME.toDateString()}</p>
					<p><strong>Owner:</strong> {selectedFile?.IS_OWNER ? "yes" : "no"}</p>
				</div>
				<div className="file-actions">
					<a href={`/api/files/${selectedFile?.ID}/download`} download={selectedFile?.FILENAME}>
						<span className="file-download-link">
							<DownloadIcon style={{fontSize: "2rem"}}/>
						</span>
					</a>
					{selectedFile?.IS_OWNER ?
						<button onClick={() => showShare(selectedFile)} style={{ width: "1rem" }}>
							<ShareIcon style={{fontSize: "2rem"}}/>
						</button>
						: ""}
					<DeleteFileButton FILE_ID={selectedFile?.ID || ""} IS_OWNER={selectedFile?.IS_OWNER || false} />
				</div>
			</div>
		</div>
		<h1>Page {page + 1} / {totalPages}<br />{itemsPerPage} per page</h1>
		<div className="table-cont">
			<table>
				<thead>
					<tr>
						<th style={{ textAlign: "center", width: "1rem" }}>#</th>
						<th style={{ textAlign: "center", width: "80%" }}>Filename</th>
						<th>Size (MB)</th>
					</tr>
				</thead>
				<tbody>
					{files.slice(pageStartIdx, pageEndIdx).map((file, i) => (
						<tr key={file.ID}
							className={(i + page * itemsPerPage) === selectedIdx ? "table-row-highlighted" : "table-row"}
							onClick={() => setSelectedIdx(i + page * itemsPerPage)}>
							<td style={{ textAlign: "center", width: "1rem", overflow: "hidden" }}>{pageStartIdx + i + 1}</td>
							<td style={{ width: "70%" }}>
								{file.FILENAME}
							</td>
							<td style={{ textAlign: "center" }}>{(file.SIZE_BYTES / Math.pow(10, 6)).toFixed(2)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
		<div>
			{pageStartIdx > 0 ?
				<button onClick={prevPage} className="page-button">
					Back
				</button> : ""}
			{pageEndIdx < files.length ?
				<button onClick={nextPage} className="page-button">
					Next
				</button> : ""}
		</div>
	</>)
}