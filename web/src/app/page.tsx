'use server '

// import { useEffect, useState } from 'react'
import axios from 'axios'
import MyForm from './form';

interface ok {
  tables: string[];
}

async function sendRequest(formData: any) {
  "use server"
  const resp = await axios.post(
      `http://${process.env.API_HOST}:${process.env.API_PORT}/api/user`,
      { body: formData }
  )

  console.log(resp.data)

  // console.log(resp.data)
}

export default async function Home() {
  var data: ok = {tables: ["waiting"]}
  await axios.get(`http://${process.env.API_HOST}:${process.env.API_PORT}/api/db/tables`)
    .then(res => {
      data = res.data
      console.log(data)
    })
    .catch(err => console.log(err))

  return (
    <main>
      {data.tables.map((table, key) => <p key={key}>{table}</p>)}
      <MyForm sendRequest={sendRequest}/>
    </main>
  )
}
