// import { useEffect, useState } from 'react'
import axios from 'axios'

interface ok {
  tables: string[];
}


export default async function Home() {
  // const [data, setData] = useState<ok>({"tables": ["waiting"]});
  
  // useEffect(() => {
    //   console.log(`\n\n\nREMOTE HOST\n192.168.1.98\n\n\n`)
    //   axios.get(`http://192.168.1.98:5000/api/db/tables`)
    //     .then(res => setData(res.data))
    //     .catch(err => console.log(err))
    // }, []);

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
