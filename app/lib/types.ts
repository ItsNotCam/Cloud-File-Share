export type IComment = {
  USER_ID: string
  FILE_ID: string
  COMMENT: string
}

export type IFileList = {
  files: IFileProps[];
};

export type IAdminFileProps = 
  IFileProps & IUserProps 
  & {
    FILE_ID: string, 
    USER_ID: string,
		DeleteFile: (FILE_ID: string) => {}
  }

export type IFileProps = {
  ID: string
  NAME: string
  EXTENSION: string
  FILENAME: string
  DESCRIPTION: string | null
  FILE_TYPE: string
  SIZE_BYTES: number
  UPLOAD_TIME: Date
  LAST_DOWNLOAD_TIME: Date | null
  LAST_DOWNLOAD_USER_ID: string | null
}

export type IUserProps = {
	ID: string
  USERNAME: string
  PASSWORD: string
  CREATED: Date
  LAST_LOGGED_IN: Date | null
  USED_STORAGE_BYTES: number
}

export type IFileUpdate = {
  DESCRIPTION: string | undefined
  NAME: string | undefined
}

export type ICommentProps = {
  FILE_ID: string
  USER_ID: string
  COMMENT: string
}
