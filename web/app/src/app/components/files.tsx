'use client'

import { useState } from "react";

// cool icons https://www.veryicon.com/icons/file-type/

export interface FileData {
  Name: string,
  // Filename: string,
  Extension: string,
  Description: string | null,
  Size_Bytes: number,
  Upload_Time: string,
  Owner: string,
  Last_Download_Time: string | null,
  Last_Download_User_Email: string | null,
}

export default function Files(props: {updateFiles: () => Promise<FileData[]>}) {
  const [files, setFiles] = useState<FileData[]>([]);
  const updateLeFiles = () => props.updateFiles().then(f => setFiles(f))

  return (
    <div>
      <button onClick={updateLeFiles}>Update</button>
      <table className="table table-dark">
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
          {files?.map((f: FileData, i: number) => <MyFile key={i} file={f}/>)}
        </tbody>
      </table>
    </div>
  )
}

function MyFile(props: {file: FileData}): JSX.Element {
  const {file} = props;
  const mb = (file.Size_Bytes / (1*Math.pow(10, 6))).toFixed(2)

  return (
    <tr>
      <td>{file.Name}</td>
      <td>{file.Extension}</td>
      <td>{file.Description}</td>
      <td>{mb} MB</td>
      <td>{file.Upload_Time}</td>
      <td>{file.Owner}</td>
    </tr>
  )
}