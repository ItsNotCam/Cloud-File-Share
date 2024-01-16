"use client"

import React, { useState } from "react"
import axios, { AxiosProgressEvent } from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './uploadForm.css'

export default function UploadForm(props: {SERVER_SOCKET: string}): JSX.Element {
  const [file, setFile] = useState<File>()
  const [uploadingProgress, setUploadingProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const uploadFile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!file) {
      alert("failed to upload - no file was present")
      return
    }

    try {
      const data = new FormData()
      data.set('file', file)
      data.set('filesize', file.size.toString())
      
      setIsUploading(true)
      axios.post(`http://${props.SERVER_SOCKET}/api/files/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event: AxiosProgressEvent) => {
          const progress: number = event.loaded / (event.total || 9999999) * 100
          setUploadingProgress(progress)
        }
      }).then((resp) => {
        console.log(resp.data)
        setIsUploading(false)
        setUploadingProgress(0)
      })
    } catch (e: any) {
      console.error(e)
    }
  }

  const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = {
      EMAIL: email,
      PASSWORD: password,
    }
    await axios.post(`http://${props.SERVER_SOCKET}/api/user/create`, data, {
      headers: { 'Content-Type': 'application/json' },
    }).then(resp => {
      setEmail("")
      setPassword("")
    })
  }

  return (
    <div>
      <br />
      <form onSubmit={(event) => createUser(event)}>
        <label>Email: </label>
        <input 
          type="text" 
          name="EMAIL" 
          onChange={(e) => setEmail(e.target.value)} 
          value={email}/> 

        <br />
        <br />

        <label>Password: </label>
        <input 
          type="text" 
          id="password"
          name="PASSWORD"
          onChange={(e) => setPassword(e.target.value)} 
          value={password}/> 

        <br />
        <br />

        <input type="submit" value="Submit"/>
      </form>
      <br />
      <br />
      <form onSubmit={(event) => uploadFile(event)}>
        <input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])}/>
        <input type="submit" value="Upload" disabled={file == null}/>
      </form>
      {isUploading && <><br /><ProgressBar now={uploadingProgress} /></>}
    </div>
  )
}