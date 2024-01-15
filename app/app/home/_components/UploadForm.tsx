"use client"

import React, { useState } from "react"
import axios, { AxiosProgressEvent } from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './uploadform.css'

export default function UploadForm(props: {SERVER_SOCKET: string}): JSX.Element {
  const [file, setFile] = useState<File>()
  const [uploadingProgress, setUploadingProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const uploadFile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!file) return

    try {
      const data = new FormData()
      data.set('file', file)
      data.set('filesize', file.size.toString())
      data.set('EMAIL', email)
      data.set('PASSWORD', password)
      
      setIsUploading(true)
      await axios.post(`http://${props.SERVER_SOCKET}/api/file/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event: AxiosProgressEvent) => {
          const progress: number = event.loaded / (event.total || 9999999) * 100
          console.log(`${progress}`)
          setUploadingProgress(progress)
        }
      }).then(() => {
        setTimeout(() => {
          setIsUploading(false)
          setUploadingProgress(0)
        }, 1000);
      })
    } catch (e: any) {
      console.error(e)
    }
  }

  return (
    <div>
      <br />
      <form onSubmit={(event) => uploadFile(event)}>
        Email: <input type="text" name="EMAIL" onChange={(e) => setEmail(e.target.value)} /> <br /><br />
        Password: <input type="text" name="PASSWORD" onChange={(e) => setPassword(e.target.value)} /> <br /><br />
        <input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])}/>
        <input type="submit" value="Upload" />
      </form>
      {isUploading && <><br /><ProgressBar now={uploadingProgress} /></>}
    </div>
  )
}