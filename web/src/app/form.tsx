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

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        // const formData = new FormData(event.currentTarget)
        props.sendRequest({
            "email": email,
            "password": password
        })
    }

    async function sendFile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        let formData: FormData = new FormData()
        formData.append("file", file)

        props.sendFile(formData)
        // const files = Array.from(event.target.files)
        // console.log("files: ", files)
        // let target = event.target
        // if(target !== null) {
        //     var formData: FormData = new FormData()
        //     let files = (target as HTMLInputElement).files
        //     console.log(files)
        //     if(files !== null && files.length > 0) {
        //         formData.append("file", files[0])
        //         props.sendFile(formData)
        //     }
        // }
    }

    function handleFileChange(event: any) {
        setFile(event.target.files[0])
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
            <form onSubmit={sendFile}>
                <input type="file" id="file" name="file" onChange={handleFileChange}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}