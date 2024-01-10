import axios from 'axios'
import MyForm, { UserProps } from './form';
import Files, {FileData} from './files';

interface FILE_JSON {
  ID: string,
  NAME: string,
  FILENAME: string,
  EXTENSION: string,
  DESCRIPTION: string | null,
  INTERNAL_FILE_PATH: string,
  SIZE_BYTES: number,
  UPLOAD_TIME: string,
  ORIGINAL_OWNER_EMAIL: string,
  LAST_DOWNLOAD_TIME: string | null,
  LAST_DOWNLOAD_USER_EMAIL: string | null
}


async function sendRequest(data: UserProps) {
  "use server"
  
  var formData: FormData = new FormData()
  formData.append("email", data.email)
  formData.append("password", data.password)

  const resp = await axios({
    method: "post",
    url: `http://${process.env.API_HOST}:${process.env.API_PORT}/api/user`,
    data: formData,
    headers: {"Content-Type": "multipart/form-data"}
  })
}

async function sendFile(formData: FormData) {
  "use server"

  const resp = await axios({
    method: "post",
    url: `http://${process.env.API_HOST}:${process.env.API_PORT}/api/upload`,
    data: formData,
    headers: {"Content-Type": "multipart/form-data"}
  })
}

async function updateFiles(): Promise<FileData[]> {
  "use server"

  const resp = await axios({
    method: "get",
    url: `http://${process.env.API_HOST}:${process.env.API_PORT}/api/files`
  })

  const all_files: FILE_JSON[] = resp.data["files"][0]
  let data: FileData[] = []

  all_files.forEach(f => {
    data.push({
      Name: f.NAME,
      Filename: f.FILENAME,
      Extension: f.EXTENSION,
      Description: f.DESCRIPTION,
      Size_Bytes: f.SIZE_BYTES,
      Upload_Time: f.UPLOAD_TIME,
      Owner: f.ORIGINAL_OWNER_EMAIL,
      Last_Download_Time: f.LAST_DOWNLOAD_TIME,
      Last_Download_User_Email: f.LAST_DOWNLOAD_USER_EMAIL
    })
  })

  return data;
}

export default async function Home() {
  return (
    <main>
      <MyForm sendRequest={sendRequest} sendFile={sendFile}/>
      <br />
      <Files updateFiles={updateFiles}/>
    </main>
  )
}
