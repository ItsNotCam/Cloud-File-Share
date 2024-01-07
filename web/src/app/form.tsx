'use client'
import { useState, FormEvent } from 'react';

export interface FormProps {
    sendRequest: (formData: any) => Promise<void>
}


export default function MyForm(props: FormProps) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        // const formData = new FormData(event.currentTarget)
        props.sendRequest({
            "email": email,
            "password": password
        })
    }

    return (
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
    )
}