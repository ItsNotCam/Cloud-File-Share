"use client"

import React, { useState } from "react"
import axios, { AxiosError, AxiosProgressEvent } from 'axios';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './upload-form.css'

interface ValidationErrors {
  errors: string[]
}

interface IUploadFormProps {
  file: File | null
  uploadingProgress: number
  isUploading: boolean
  USERNAME: string
  PASSWORD: string
}

export default function UploadForm(props: {SERVER_SOCKET: string}): JSX.Element {
  const [state, setState] = useState<IUploadFormProps>({
    file: null,
    uploadingProgress: 0,
    isUploading: false,
    USERNAME: "",
    PASSWORD: ""
  })

  const handleFormChange = (event) => {
    const newValue: string | File = event.target.name == "file" 
      ? event.target.files?.[0] 
      : event.target.value

    setState(prev => ({
      ...prev,
      [event.target.name]: newValue
    }))
  }

  const handleProgressUpdate = (event: AxiosProgressEvent) => {
    const progress: number = event.loaded / (event.total || 9999999) * 100
    setState(prev => ({ 
      ...prev, 
      uploadingProgress: progress 
    }))
  }

  const uploadFile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!state.file) {
      alert("failed to upload - no file was present")
      return
    }

    try {
      const data: FormData = new FormData()
      data.set('file', state.file)
      data.set('filesize', state.file.size.toString())
      
      setState({ ...state, isUploading: true })
      axios.post(`http://${props.SERVER_SOCKET}/api/files/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: handleProgressUpdate
      }).then(_ => {
        setState(prev => ({ 
          ...prev, 
          isUploading: false, 
          uploadingProgress: 0 
        }))
      })
    } catch (e: any) {
      console.error(e)
    }
  }

  const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = {
      PASSWORD: state.PASSWORD,
      USERNAME: state.USERNAME
    }
    await axios.post(`http://${props.SERVER_SOCKET}/api/users/create`, data, {
      headers: { 'Content-Type': 'application/json' },
    }).then(_ => {
      setState(prev => ({ ...prev, USERNAME: "", PASSWORD: "" }))
    }).catch(err => {
      const axiosErr: AxiosError = err as AxiosError
      const {errors}: ValidationErrors = axiosErr.response?.data as ValidationErrors
      alert(errors.join(" - "))
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
            onChange={handleFormChange} 
            /> 
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
            onChange={handleFormChange} 
            /> 
        </div>

        <br />

        <input type="submit" value="Create User" className="btn btn-primary"/>
      </form>
      <br />
      <br />
      <form onSubmit={(event) => uploadFile(event)}>
        <input type="file" name="file" onChange={handleFormChange}/>
        <input type="submit" value="Upload" disabled={state.file == null}/>
      </form>
      {state.isUploading && <><br /><ProgressBar now={state.uploadingProgress} /></>}
    </div>
  )
}