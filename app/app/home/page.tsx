import { SERVER_SOCKET } from "../helpers/constants"

interface FileProps {
  UUID: string,
  NAME: string,
  FILENAME: string,
  EXTENSION: string | null,
  DESCRIPTION: string | null,
  SIZE_BYTES: number,
  UPLOAD_TIME: string,
  ORIGINAL_OWNER_EMAIL: string,
  LAST_DOWNLOAD_TIME: string | null,
  LAST_DOWNLOAD_USER_EMAIL: string | null,
}

export default async function Home() {
  const { files } = await fetch(`http://${SERVER_SOCKET}/api/files`)
    .then(d => d.json())

  return (
    <div className="container">
      <br />
      <br />
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
    </div>
  )
}

const File = (props: FileProps): JSX.Element => {
  let size: string = ""

  if(props.SIZE_BYTES >= Math.pow(1, 6)) {
    size = (props.SIZE_BYTES / Math.pow(10, 6)).toFixed(2)
  } else {
    size = (props.SIZE_BYTES / Math.pow(10, 3)).toFixed(2)
  }

  return (
    <tr>
      <td scope="row">{props.NAME}</td>
      <td scope="row">{props.EXTENSION}</td>
      <td scope="row">{props.DESCRIPTION}</td>
      <td scope="row">{size} MB</td>
      <td scope="row">{props.UPLOAD_TIME}</td>
      <td scope="row">{props.ORIGINAL_OWNER_EMAIL}</td>
    </tr>
  )
}