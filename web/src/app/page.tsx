'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface ok {
  tables: string[];
}


export default function Home() {
  const [data, setData] = useState<ok>({"tables": ["waiting"]});

  useEffect(() => {
    axios.get("http://localhost:5000/api/db/tables")
      .then(res => setData(res.data))
  }, []);

  return (
    <div>
      {data.tables.map(table => <p>{table}</p>)}
    </div>
  )
}
