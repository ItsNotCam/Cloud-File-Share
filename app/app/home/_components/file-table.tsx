"use client"
import { IDBFile } from "@/lib/db/DBFiles";

import DownloadIcon from '@mui/icons-material/Download';
import DeleteFileButton from "./delete-file-button";
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShareIcon from '@mui/icons-material/Share';
import Share from "./share-file";
import { useState } from "react";

export default function FileTable(props: { files: IDBFile[] }): JSX.Element {
	const [showShareMenu, setShowShareMenu] = useState<boolean>(false)
	const [filetoShare, setFileToShare] = useState<IDBFile | undefined>(undefined)
	const [startIdx, setStartIdx] = useState<number>(0)

	const [page, setPage] = useState<number>(0)
	// const [itemsPerPage, setItemsPerPage] = useState<number>(5)

	const itemsPerPage = 15;

	const { files } = props;

	const shareFile = (FILE_ID: string) => {
		let data = {ok:"ok"}
		fetch(`/api/files/${FILE_ID}/share`, {
			method: "post",
			body: JSON.stringify(data)
		})
	}

	const showShare = (file: IDBFile) => {
		setFileToShare(file)
		setShowShareMenu(true)
	}

	const nextPage = () => {
		setStartIdx(prev => prev+(1*itemsPerPage))
		setPage(prev => Math.min(prev+1, Math.floor(files.length / itemsPerPage)))
	}
	
	const prevPage = () => {
		setStartIdx(prev => Math.max(0, prev-(1*itemsPerPage)))
		setPage(prev => Math.max(0, prev-1))
	}
	
	const updateItemsPerPage = (e) => {
		// setItemsPerPage(e.target.value)
		setPage(0)
	}

	return (<>
		{
			showShareMenu && filetoShare !== undefined 
				? <Share file={filetoShare} hideShareMenu={() => setShowShareMenu(false)}/> 
				: ""
		}
		<table>
			<thead>
				<tr>
					<th style={{textAlign: "center"}}>Actions</th>
					<th>Filename</th>
					<th>Description</th>
					<th>Size (MB)</th>
					<th>Owner?</th>
					<th style={{textAlign: "center"}}>DEL</th>
				</tr>
			</thead>
			<tbody>
				{files.slice((page*itemsPerPage), (page*itemsPerPage)+itemsPerPage).map(file => (
					<tr key={file.ID}>
						<td style={{textAlign: "center"}}>
							<a href={`/api/files/${file.ID}/download`} download={file.FILENAME}>
								<span className="file-download-link">
									<DownloadIcon color={"inherit"}/>
								</span>
							</a>
							<a href="#"  style={{paddingInline: "0.5rem"}}>
								<EditNoteIcon />
							</a>
							{ file.IS_OWNER ? 
							<button onClick={() => showShare(file)}>
								<ShareIcon />
							</button>
							: ""}
						</td>
						<td>
							{file.FILENAME}
						</td>
						<td>{file.DESCRIPTION}</td>
						<td>{file.SIZE_BYTES / Math.pow(10,6)}</td>
						<td style={{backgroundColor: file.IS_OWNER ? "#172b1a" : "#2e1616"}}>{file.IS_OWNER ? "Yes" : "No"}</td>
						<td style={{textAlign: "center"}}>
							<DeleteFileButton FILE_ID={file.ID} IS_OWNER={file.IS_OWNER}/>
						</td>
					</tr>
				))}
			</tbody>
		</table>
		<div>
			<button onClick={prevPage} style={{border: "1px solid gray", padding: "10px", margin: "10px"}}>Back</button>
			<button onClick={nextPage} style={{border: "1px solid gray", padding: "10px", margin: "10px"}}>Next</button>
		</div>
		<h1>Page {page+1}</h1>
	</>)
}