
export type FileList = {
  files: FileProps[];
};// import {GetFiles} from '@app/api/admin/files/route.ts'

export type FileProps = {
  UUID: string
  NAME: string
  FILENAME: string
  EXTENSION: string | null
  DESCRIPTION: string | null
  SIZE_BYTES: number
  UPLOAD_TIME: Date
  OWNER_ID: string
  LAST_DOWNLOAD_TIME: string | null
  LAST_DOWNLOAD_USER_ID: string | null
}
export interface IUserProps {
  EMAIL: string;
  PASSWORD: string;
}

