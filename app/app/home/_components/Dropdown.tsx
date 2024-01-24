"use client"

import React, { useState } from "react"

import GamesIcon from '@mui/icons-material/Games';
import DownloadIcon from '@mui/icons-material/Download';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';

import './dropdown.css'

interface IMouseContext {
	pos: {
		left: number,
		top: number
	},
	inDropdown: boolean
}

export default function FilesContextDropdown(props: { children: JSX.Element[] }) {
	const [mouseContext, setMouseContext] = useState<IMouseContext>({
		pos: { left: 0, top: 0 },
		inDropdown: false,
	})
	const [infoShown, setInfoShown] = useState<boolean>(false);

	const DROPDOWN_WIDTH: number = 350;
	const DROPDOWN_HEIGHT: number = 290;

	function handleMouseMove(ev: React.MouseEvent) {
		if (infoShown)
			return;

		setMouseContext({
			...mouseContext,
			pos: {
				left: ev.pageX,
				top: ev.pageY
			}
		})
	}

	function handleMouseEnter(ev: React.MouseEvent) {
		setMouseContext({
			...mouseContext,
			inDropdown: true
		})
	}

	function handleMouseLeave(ev: React.MouseEvent) {
		setMouseContext({
			...mouseContext,
			inDropdown: false
		})
	}

	function handleAuxClick(ev: React.MouseEvent) {
		ev.preventDefault();
		setMouseContext({
			...mouseContext,
			pos: {
				left: ev.pageX,
				top: ev.pageY
			}
		})
		setInfoShown(prev => !prev);
	}

	function handleContextMenu(ev: React.MouseEvent) {
		ev.preventDefault();
		return false;
	}

	function handleClick(ev: React.MouseEvent) {
		if (!mouseContext.inDropdown) {
			setInfoShown(false);
		}
	}

	const dropdownStyle = {
		left: mouseContext.pos.left,
		top: mouseContext.pos.top + 5,
		width: `${DROPDOWN_WIDTH}px`
	}

	// lock to the height and width of the screen
	if (window.innerWidth - mouseContext.pos.left < (DROPDOWN_WIDTH + 5)) {
		dropdownStyle.left = window.innerWidth - (DROPDOWN_WIDTH + 5);
	}

	if (window.innerHeight - mouseContext.pos.top < DROPDOWN_HEIGHT) {
		dropdownStyle.top = window.innerHeight - DROPDOWN_HEIGHT;
	}

	return (
		<div
			onMouseMove={handleMouseMove}
			onAuxClick={handleAuxClick}
			onContextMenu={handleContextMenu}
			onClick={handleClick}
		>
			{infoShown && (
				<div className="dropdown"
					style={dropdownStyle}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}>
					<DropdownItem>
						<DownloadIcon />
						<p>Download</p>
					</DropdownItem>
					<DropdownItem>
						<BorderColorIcon />
						<p>Rename</p>
					</DropdownItem>
					<DropdownItem>
						<ContentCopyIcon />
						<p>Duplicate</p>
					</DropdownItem>

					<div className="line" />

					<DropdownItem>
						<ShareIcon />
						<p>Share</p>
					</DropdownItem>
					<DropdownItem>
						<InfoIcon />
						<p>File Information</p>
					</DropdownItem>

					<div className="line" />

					<DropdownItem>
						<DeleteIcon />
						<p>Move to Trash</p>
					</DropdownItem>
				</div>)
			}
			{props.children}
		</div>
	)
}

function DropdownItem(props: { children: JSX.Element[], clicked?: () => void }) {
	return (
		<div className="dropdown-item">
			{props.children}
		</div>
	)
}