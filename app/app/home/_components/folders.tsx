"use client"

import { useState } from "react";
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { IFolderProps } from "@/lib/db/DBFiles";

export const FolderRoot = (props: { 
	folders: IFolderProps, 
	selectedFolder: IFolderProps | undefined, 
	setSelectedFolder: (folder: IFolderProps) => void 
}): JSX.Element => {
	if (props.folders?.CHILDREN === undefined) {
		return (
			<div className="folder-wrapper"><h1>loading...</h1></div>
		)
	}

	const ALL_FILES: IFolderProps = {
		ID: "ALL_FILES",
		NAME: "All Files",
		COLOR: "#339933",
		CHILDREN: []
	}

	return (
		<div className="folder-wrapper">
			<Folder
				folder={ALL_FILES}
				indent={0}
				key="ALL_FILES"
				setSelectedFolder={props.setSelectedFolder}
				selectedFolder={props.selectedFolder}
			/>
			{props.folders?.CHILDREN.map((folder: IFolderProps) =>
				<Folder 
					folder={folder} 
					indent={0} 
					key={folder.ID} 
					setSelectedFolder={props.setSelectedFolder}
					selectedFolder={props.selectedFolder}
				/>
			)}
		</div>
	)
}

const Folder = (props: { 
	folder: IFolderProps, 
	indent: number, 
	selectedFolder: IFolderProps | undefined, 
	setSelectedFolder: (folder: IFolderProps) => void 
}): JSX.Element => {
	const { indent } = props
	const [isDroppedDown, setIsDroppedDown] = useState<boolean>(false)

	const isSelected = props.selectedFolder?.ID === props.folder.ID
	const hasChildren = props.folder.CHILDREN.length > 0

	return (<>
		<div className={`folder-structure ${isSelected ? "folder-selected" : ""}`}>
			<div style={{position: "relative"}}>
				<div className="folder-name" style={{ 
					left: `${indent * 1.5}rem`, 
					width: `calc(100% - ${indent * 1.1}rem)`, 
					position: "absolute"
				}}
				onClick={() => props.setSelectedFolder(props.folder)}
				>
					{isDroppedDown && hasChildren
						? (
						<FolderOpenOutlinedIcon 
								style={{ color: props.folder.COLOR || "#737373" }} 
								fontSize="small"
								className={`${hasChildren ? "cursor-pointer" : ""}`}
								onClick={() => { hasChildren && setIsDroppedDown(!isDroppedDown) }}
							/>
						) : (
							<FolderIcon 
								style={{ color: props.folder.COLOR || "#737373" }} 
								fontSize="small"
								className={`${hasChildren ? "cursor-pointer" : ""}`}
								onClick={() => { hasChildren && setIsDroppedDown(!isDroppedDown) }}
							/>
						)
					}
					<span>
						{props.folder.NAME}
					</span>
				</div>
			</div>
		</div>
		<div className={`${isDroppedDown ? "" : "hidden"}`}>
			{props.folder.CHILDREN.map((item: IFolderProps) =>
				<Folder 
					folder={item} 
					indent={indent + 1} 
					key={item.ID} 
					setSelectedFolder={props.setSelectedFolder}
					selectedFolder={props.selectedFolder}
				/>
			)}
		</div>
	</>)
}