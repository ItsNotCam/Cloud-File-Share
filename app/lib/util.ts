import { IFileInfo } from "@/app/api/files/upload/route"
import {v4 as uuidv4} from 'uuid'

export const calcFileSize = (bytes: number): string => {
	const kb = Math.pow(10, 3)
	const mb = Math.pow(10, 6)
	const gb = Math.pow(10, 9)

	if(bytes >= gb) {
		return `${(bytes / gb).toFixed(2)} GB`
	} else if(bytes >= mb) {
		return `${(bytes / mb).toFixed(2)} MB`
	} else if(bytes >= kb) {
		return `${(bytes / kb).toFixed(2)} KB`
	} else {
		return `${bytes} B`
	}
}

export const toDateString = (date: Date): string => {
	const parsedDate = new Date(date)
	const monthNames = [
		"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
	]
	return `${monthNames[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`
}

export async function getFileInfo(file: File): Promise<IFileInfo> {
	const regex = new RegExp(/(.*)(\.\w*)$|(.*)$/g);
	const match = regex.exec(file.name);
	const [FILENAME, NAME, EXTENSION] = match ?? ["", file.name, file.name];
	return {
		FILE_ID: uuidv4(),
		FILENAME: FILENAME,
		EXTENSION: EXTENSION,
		NAME: NAME
	};
}