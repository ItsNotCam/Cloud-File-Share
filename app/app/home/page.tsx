import { promises as fs } from "fs"
import { SERVER_SOCKET } from "../helpers/constants"
import {TreeRoot} from './tree'
import UploadForm from "./UploadForm"

interface FileProps {
  UUID: string,
  NAME: string,
  FILENAME: string,
  EXTENSION: string | null,
  DESCRIPTION: string | null,
  SIZE_BYTES: number,
  UPLOAD_TIME: string,
  OWNER_ID: string,
  LAST_DOWNLOAD_TIME: string | null,
  LAST_DOWNLOAD_USER_ID: string | null,
}

export default async function Home() {
  //{ files } 
  const data = await fetch(`http://${SERVER_SOCKET}/api/files`)
    .then(d => d.json())
  const files = data.files

  // const files = ok.files
  const stuff = await fs.readFile(process.cwd() + "/data/directories/cam.json", 'utf8');
  const js = JSON.parse(stuff)

  return (
    <div className="container">
      <br /><br />
      {/* <div style={{userSelect: "none"}}>
        <TreeRoot {...js}/>
      </div> */}
      <table className="table table-dark table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Extension</th>
            <th scope="col">Description</th>
            <th scope="col">Size</th>
            <th scope="col">Upload Time</th>
            <th scope="col">Uploader</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file: FileProps, idx: number) => <File {...file} key={idx} />)}
        </tbody>
      </table>
      <UploadForm SERVER_SOCKET={SERVER_SOCKET} />
    </div>
  )
}

const File = (props: FileProps): JSX.Element => {
  let size: string = ""

  if(props.SIZE_BYTES >= 1024) {
    size = (props.SIZE_BYTES / Math.pow(10, 6)).toFixed(2)
  } else {
    size = (props.SIZE_BYTES / Math.pow(10, 3)).toFixed(2)
  }

  return (
    <tr>
      <td scope="row">{props.NAME}</td>
      <td scope="row">{props.EXTENSION}</td>
      <td scope="row">{props.DESCRIPTION || ""}</td>
      <td scope="row">{size} MB</td>
      <td scope="row">{props.UPLOAD_TIME}</td>
      <td scope="row">{props.OWNER_ID}</td>
    </tr>
  )
}