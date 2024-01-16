export type IFileList = {
  files: IFileProps[];
};

export type IAdminFileProps = IFileProps & IUserProps

export type IFileProps = {
  ID: string
  NAME: string
  EXTENSION: string
  DESCRIPTION: string | null
  FILE_TYPE: string
  SIZE_BYTES: number
  UPLOAD_TIME: Date
  OWNER_ID: string
  LAST_DOWNLOAD_TIME: Date | null
  LAST_DOWNLOAD_USER_ID: string | null
}

export type IUserProps = {
  USERNAME: string
  EMAIL: string
  PASSWORD: string
  CREATED: Date
  LAST_LOGGED_IN: Date | null
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
