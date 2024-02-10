"use client"

import { useState } from "react";
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import { IFolderProps } from "@/lib/db/DBFiles";

export const TreeRoot = (props: { 
	folders: IFolderProps, 
	selectedFolder: IFolderProps | undefined, 
	setSelectedFolder: (folder: IFolderProps) => void 
}): JSX.Element => {
	if (props.folders.CHILDREN === undefined) {
		return (<h1>loading...</h1>)
	}

	return (
		<div className="folder-wrapper">
			{props.folders.CHILDREN.map((folder: IFolderProps) =>
				<Tree 
					item={folder} 
					indent={0} 
					key={folder.ID} 
					setSelectedFolder={props.setSelectedFolder}
					selectedFolder={props.selectedFolder}
				/>
			)}
		</div>
	)
}

const Tree = (props: { 
	item: IFolderProps, 
	indent: number, 
	selectedFolder: IFolderProps | undefined, 
	setSelectedFolder: (folder: IFolderProps) => void 
}): JSX.Element => {
	const { indent } = props
	const [isDroppedDown, setIsDroppedDown] = useState<boolean>(false)

	return (<>
		<div className={`folder-structure ${props.selectedFolder?.ID === props.item.ID ? "folder-selected" : ""}`}>
			<div style={{position: "relative"}}>
				<div className="folder-name" style={{ 
					left: `${indent * 1.5}rem`, 
					width: `calc(100% - ${indent * 1.1}rem)`, 
					position: "absolute"
				}}
				onClick={() => props.setSelectedFolder(props.item)}
				>
					{isDroppedDown && props.item.CHILDREN.length > 0
						? (
						<FolderOpenOutlinedIcon 
								style={{ color: props.item.COLOR || "#737373" }} 
								fontSize="small"
								className="cursor-pointer"
								onClick={() => { props.item.CHILDREN.length > 0 && setIsDroppedDown(!isDroppedDown) }}
							/>
						) : (
							<FolderIcon 
								style={{ color: props.item.COLOR || "#737373" }} 
								fontSize="small"
								className="cursor-pointer"
								onClick={() => { props.item.CHILDREN.length > 0 && setIsDroppedDown(!isDroppedDown) }}
							/>
						)
					}
					<span>
						{props.item.NAME}
					</span>
				</div>
			</div>
		</div>
		<div className={`${isDroppedDown ? "" : "hidden"}`}>
			{props.item.CHILDREN.map((item: IFolderProps) =>
				<Tree 
					item={item} 
					indent={indent + 1} 
					key={item.ID} 
					setSelectedFolder={props.setSelectedFolder}
					selectedFolder={props.selectedFolder}
				/>
			)}
		</div>
	</>)
}