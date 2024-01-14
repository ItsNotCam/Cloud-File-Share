"use client"

import React, { useState } from "react"
import axios, { AxiosProgressEvent } from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './uploadform.css'

export default function UploadForm(props: {SERVER_SOCKET: string}): JSX.Element {
  const [file, setFile] = useState<File>()
  const [uploadingProgress, setUploadingProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const uploadFile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!file) return

    try {
      const data = new FormData()
      data.set('file', file)
      data.set('filesize', file.size.toString())
      
      setIsUploading(true)
      const res = await axios.post(`http://${props.SERVER_SOCKET}/api/files/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event: AxiosProgressEvent) => {
          const progress: number = event.loaded / (event.total || 9999999) * 100
          console.log(`${progress}`)
          setUploadingProgress(progress)
        }
      }).then(() => {
        setIsUploading(false)
        setUploadingProgress(0)
      })
    } catch (e: any) {
      console.error(e)
    }
  }

  return (
    <div>
      <form onSubmit={(event) => uploadFile(event)}>
        <input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])}/>
        <input type="submit" value="Upload" />
      </form>
      <ProgressBar now={uploadingProgress} />
    </div>
  )
}
//style={{width: `${uploadingProgress * 100 + 50}vw`, height: `10px`, color: 'orange', zIndex: 99999}} 