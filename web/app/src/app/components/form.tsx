'use client'
import { useState, FormEvent } from 'react';

export interface FormProps {
  sendRequest: (data: any) => Promise<void>
  sendFile: (data: FormData) => Promise<void>
}

export interface UserProps {
  email: string,
  password: string
}

export default function MyForm(props: FormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [file, setFile] = useState("");
  const [description, setDescription] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // const formData = new FormData(event.currentTarget)
    props.sendRequest({
      "email": email,
      "password": password
    })
  }

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let formData: FormData = new FormData()
    formData.append("file", file)
    formData.append("description", description)

    props.sendFile(formData)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          name='email'
          type="email"
          placeholder='email'
          required
          onChange={(event: any) => setEmail(event.target.value)}
          value={email}
        /><br />

        <input
          type="password"
          id="password"
          name='password'
          placeholder="password"
          required
          onChange={(event: any) => setPassword(event.target.value)}
          value={password}
        /><br />

        <button type="submit">Submit</button>
      </form>
      <br />
      <form onSubmit={uploadFile}>
        <input type="text"
          id="description"
          name="description"
          onChange={(event: any) => setDescription(event.target.value)}
          value={description}
        /><br />
        <input type="file"
          id="file"
          name="file"
          onChange={(event: any) => { setFile(event.target.files[0]) }}
        /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}