"use client"

import React, { useState } from "react"
import axios, { AxiosError, AxiosProgressEvent } from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './upload-form.css'

interface ValidationErrors {
  errors: string[]
}

export default function UploadForm(props: {SERVER_SOCKET: string}): JSX.Element {
  const [file, setFile] = useState<File>()
  const [uploadingProgress, setUploadingProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const [username, setUsername] = useState<string>("")
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
      PASSWORD: password,
      USERNAME: username
    }
    await axios.post(`http://${props.SERVER_SOCKET}/api/users/create`, data, {
      headers: { 'Content-Type': 'application/json' },
    }).then(resp => {
      setPassword("")
      setUsername("")
    }).catch(err => {
      const axiosErr: AxiosError = err as AxiosError
      const {errors}: ValidationErrors = axiosErr.response?.data as ValidationErrors
      alert(errors.join(" - "))
      console.log(axiosErr.response?.data)
    })
  }

  return (
    <div>
      <br />
      <form onSubmit={(event) => createUser(event)} style={{backgroundColor: "#4D4C56", borderRadius: "5px", padding: "20px"}}>
        <div className="mb3">
          <label htmlFor="USERNAME" className="form-label color-light" style={{color: "white"}}>Username</label>
          <input 
            className="form-control"
            type="text" 
            name="USERNAME" 
            style={{backgroundColor: "#323239", borderColor: "#1D1D21", color: "white"}}
            onChange={(e) => setUsername(e.target.value)} 
            value={username}/> 
        </div>

        <br />

        <div className="mb3">
          <label htmlFor="PASSWORD" className="form-label" style={{color: "white"}}>Password</label>
          <input 
            className="form-control"
            type="text" 
            id="password"
            name="PASSWORD"
            style={{backgroundColor: "#323239", borderColor: "#1D1D21", color: "white"}}
            onChange={(e) => setPassword(e.target.value)} 
            value={password}/> 
        </div>

        <br />

        <input type="submit" value="Create User" className="btn btn-primary"/>
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