// import { useEffect, useState } from 'react'
import axios from 'axios'

interface ok {
  tables: string[];
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
    </main>
  )
}
