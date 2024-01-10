import axios from 'axios'
import Files, {FileData} from './components/files';
import MyForm, { UserProps } from './components/form';

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

const API_SOCKET: string = `${process.env.API_HOST || "localhost"}:${process.env.API_PORT || "5000"}`

async function sendRequest(data: UserProps) {
  "use server"
  
  let formData: FormData = new FormData()
  formData.append("email", data.email)
  formData.append("password", data.password)

  axios({
    method: "post",
    url: `http://${API_SOCKET}/api/user`,
    data: formData,
    headers: {"Content-Type": "multipart/form-data"}
  })
}

async function sendFile(formData: FormData) {
  "use server"

  axios({
    method: "post",
    url: `http://${API_SOCKET}/api/upload`,
    data: formData,
    headers: {"Content-Type": "multipart/form-data"}
  })
}

async function updateFiles(): Promise<FileData[]> {
  "use server"

  const resp = await axios({
    method: "get",
    url: `http://${API_SOCKET}/api/files`
  })

  const all_files: FILE_JSON[] = resp.data["files"][0]
  let data: FileData[] = []

  all_files.forEach(f => {
    data.push({
      Name: f.NAME,
      // Filename: f.FILENAME,
      Extension: f.EXTENSION.replace(".", ""),
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
      <br /><br />
      <Files updateFiles={updateFiles}/>
    </main>
  )
}
