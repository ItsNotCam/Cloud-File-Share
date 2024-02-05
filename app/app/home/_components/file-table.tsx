// import './_file-table.css'

import { IDBFile } from "@/lib/db/DBFiles";
import React, { useState } from 'react';
import FileTableRow from "./file-table-row";
import { IUploadingFile } from "../page";


interface IFileTableProps {
	setSelected: (index: number) => void,
	refreshFileInfo: (index: number) => void,
	files: IUploadingFile[],
	selectedFileIdx: number,
	infoShown: boolean,
	uploadFileRef: any
}

export default function FileTable(props: IFileTableProps): React.ReactNode {
	let {
		setSelected,
		refreshFileInfo,
		files,
		selectedFileIdx,
	} = props;

	const [uploadingFiles, setUploadingFiles] = useState<any>()
	const [filename, setFilename] = useState<string>("")

	const updateFilename = (index: number) => {
		const file = files[index]
		fetch(`/api/files/${file.ID}`, {
			method: "PATCH",
			body: JSON.stringify({ name: filename })
		}).then(() => {
			refreshFileInfo(index)
		})
	}

	return(
		<div className="file-grid">
			<div className="h-full">
				{files.map((file, index) => (
					<div onClick={() => setSelected(index)}>
						<FileTableRow 
							index={index}
							files={files}
							// uploadProgress={uploadingFiles.get(file.NAME).progress}
							isSelected={index === selectedFileIdx}
							setSelected={() => setSelected(index)}
							updateFilename={() => updateFilename(index)} 
							uploadRef={props.uploadFileRef}
						/>
					</div>
				))}
			</div>
		</div>
	)
}
 //return (
// 	<TableContainer component={Paper} sx={{width: "100%", boxShadow: "0 0 0 0 transparent !important"}}>
// 		<Table stickyHeader sx={{width: "100%"}}>
// 			<TableHead>
// 				<TableRow>
// 					<TableCell className="font-semibold text-lg" style={{maxWidth: "2rem"}}></TableCell>
// 					<TableCell className="font-semibold text-lg expand">Name</TableCell>
// 					<TableCell className="font-semibold text-lg">Owner</TableCell>
// 					<TableCell className="font-semibold text-lg">Uploaded</TableCell>
// 					<TableCell className="font-semibold text-lg" style={{maxWidth: "20rem"}}>File Size</TableCell>
// 					<TableCell className="font-semibold text-lg"></TableCell>
// 				</TableRow>
// 			</TableHead>
// 			<TableBody>
// 				{files.map((file, index) => (
// 				<TableRow className={`file-table-row ${index === selectedFileIdx ? "file-table-row-selected" : ""}`} 
// 					onClick={() => setSelected(index)}
// 				>
// 					<TableCell style={{maxWidth: "2rem" }}>
// 						<FileIcon extension={file.EXTENSION} />
// 					</TableCell>
// 					<TableCell onClick={() => tryEditFilename(index)}>
// 						<div className={`${index === selectedFileIdx ? "cursor-text" : ""}`}>
// 							<span style={{ display: editingFilename && selectedFileIdx === index ? "block" : "none" }}>
// 								<input type="text"
// 									className="filename-input"
// 									value={filename}
// 									onChange={(e) => setFilename(e.target.value)}
// 									onBlur={() => resetFilename(index)}
// 									ref={textInputRef}
// 									onKeyDown={handleKeyDown}
// 								/>
// 							</span>
// 							<span style={{ display: editingFilename && selectedFileIdx === index ? "none" : "contents" }} onClick={() => setSelected(index)}>
// 								{`${file.NAME}${file.EXTENSION}`}
// 							</span>
// 						</div>
// 					</TableCell>
// 					<TableCell className={"table-col-1" + infoShown ? "-info" : ""}>{file.IS_OWNER ? "me" : "~"}</TableCell>
// 					<TableCell className={"table-col-2" + infoShown ? "-info" : ""}>{toDateString(file.UPLOAD_TIME)}</TableCell>
// 					<TableCell className={"table-col-3" + infoShown ? "-info" : ""}>{calcFileSize(file.SIZE_BYTES)}</TableCell>
// 					<TableCell className={"table-col-4" + infoShown ? "-info" : ""}><FileActions file={file} /></TableCell>
// 				</TableRow>))}
// 			</TableBody>
// 		</Table>
// 	</TableContainer>
// )
// return (
// 	<table>
// 		<thead>
// 			<tr className="text-left table-title">
// 				<th style={{width: "2rem"}}>Name</th>
// 				<th className={`table-col-0` + infoShown ? "-info" : ""}></th>
// 				<th className={`table-col-1` + infoShown ? "-info" : ""}>Owner</th>
// 				<th className={`table-col-2` + infoShown ? "-info" : ""}>Uploaded</th>
// 				<th className={`table-col-3` + infoShown ? "-info" : ""}>File Size</th>
// 				<th className={`table-col-4` + infoShown ? "-info" : ""}></th>
// 			</tr>
// 		</thead>
// 		<tbody>
// 			{files.map((file, index) => (
// 				<tr key={file.ID}
// 					className={`file-table-row ${index === selectedFileIdx ? "file-table-row-selected" : ""}`}
// 					onClick={() => setSelected(index)}
// 				>
// 					<td style={{width: "2rem"}}>
// 						<FileIcon extension={file.EXTENSION} />
// 					</td>
// 					<td className={`table-col-0 table-name-field ${index === selectedFileIdx ? "cursor-text" : ""}`}
// 							onClick={() => tryEditFilename(index)}>
// 						<input type="text"
// 							className="filename-input"
// 							value={filename}
// 							onChange={(e) => setFilename(e.target.value)}
// 							onBlur={() => resetFilename(index)}
// 							ref={textInputRef}
// 							style={{ display: editingFilename && selectedFileIdx === index ? "flex" : "none" }}
// 							onKeyDown={handleKeyDown}
// 						/>
// 						<span style={{ display: editingFilename && selectedFileIdx === index ? "none" : "contents" }}>
// 							{`${file.NAME}${file.EXTENSION}`}
// 						</span>
// 					</td>
// 					<td className={"table-col-1" + infoShown ? "-info" : ""}>{file.IS_OWNER ? "me" : "~"}</td>
// 					<td className={"table-col-2" + infoShown ? "-info" : ""}>{toDateString(file.UPLOAD_TIME)}</td>
// 					<td className={"table-col-3" + infoShown ? "-info" : ""}>{calcFileSize(file.SIZE_BYTES)}</td>
// 					<td className={"table-col-4" + infoShown ? "-info" : ""}><FileActions file={file} /></td>
// 				</tr>
// 			))}
// 		</tbody>
// 	</table>
// )

// return (
// <div className='file-table-wrapper'>
// 	<table className="file-table">
// 		<thead>
// 			<tr className="text-left">
// 				<th className="w-3/5">Name</th>
// 				<th className='file-table-1'>Owner</th>
// 				<th className='file-table-2'>Uploaded</th>
// 				<th className='file-table-3'>File Size</th>
// 				<th className="file-width-4"></th>
// 			</tr>
// 		</thead>
// 		<tbody>
// 			{files.map((file, i) => (
// 				<tr key={file.ID} className={getRowCSSClasses(i)} onClick={() => setSelected(i)}>
// 					<td className={`name-field ${i === selectedFileIdx ? "cursor-text" : ""}`}>
// 						<FileIcon extension={file.EXTENSION} />
// 						<div onClick={() => tryEditFilename(i)}>
// 							<input type="text"
// 								className="filename-input"
// 								value={filename}
// 								onChange={(e) => setFilename(e.target.value)}
// 								onBlur={() => resetFilename(i)}
// 								ref={textInputRef}
// 								style={{ display: editingFilename && selectedFileIdx === i ? "block" : "none" }}
// 								onKeyDown={handleKeyDown}
// 							/>
// 							<span style={{ display: editingFilename && selectedFileIdx === i ? "none" : "block" }}>
// 								{`${file.NAME}${file.EXTENSION}`}
// 							</span>
// 						</div>
// 					</td>
// 					<td className="text-left file-table-1">{file.IS_OWNER ? "me" : "~"}</td>
// 					<td className="text-left file-table-2">{toDateString(file.UPLOAD_TIME)}</td>
// 					<td className="text-left file-table-3">{calcFileSize(file.SIZE_BYTES)}</td>
// 					<td className="file-table-4"><FileActions file={file} /></td>
// 				</tr>
// 			))}
// 		</tbody>
// 	</table>
// </div>)