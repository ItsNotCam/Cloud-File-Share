import { SERVER_SOCKET } from "@/app/_helpers/constants"
import UploadForm from "@/app/home/_components/uploadForm"
import { GetFiles } from "@/app/api/admin/files/route"
import { IAdminFileProps, IFileProps } from "../_helpers/types"

export default async function Home() {
  const files: IAdminFileProps[] = await GetFiles().then(f => f.files)

  return (
    <div className="container">
      <br /><br />
      <table className="table table-dark table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Size</th>
            <th scope="col">Upload Time</th>
            <th scope="col">Uploader</th>
            <th scope="col">Created</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file: IAdminFileProps) => <File {...file} key={file.ID} />)}
        </tbody>
      </table>
      <UploadForm SERVER_SOCKET={SERVER_SOCKET} />
    </div>
  )
}

const File = async (props: IAdminFileProps): Promise<JSX.Element> => {
  let size: string = ""

  if(props.SIZE_BYTES >= 1024) {
    size = (props.SIZE_BYTES / Math.pow(10, 6)).toFixed(2)
  } else {
    size = (props.SIZE_BYTES / Math.pow(10, 3)).toFixed(2)
  }

  return (
    <tr>
      <td scope="row">{props.NAME}{props.EXTENSION}</td>
      <td scope="row">{props.DESCRIPTION || ""}</td>
      <td scope="row">{size} MB</td>
      <td scope="row">{props.UPLOAD_TIME?.toString()}</td>
      <td scope="row">{props.EMAIL}</td>
      <td scope="row">{props.CREATED.toString()}</td>
    </tr>
  )
}