import axios from 'axios'
import MyForm, { UserProps } from './form';

interface ok {
  tables: string[];
}

async function sendRequest(data: UserProps) {
  "use server"

  var formData = new FormData()
  formData.append("email", data.email)
  formData.append("password", data.password)

  const resp = await axios({
    method: "post",
    url: `http://${process.env.API_HOST}:${process.env.API_PORT}/api/user`,
    data: formData,
    headers: {"Content-Type": "multipart/form-data"}
  })

  console.log(resp.data)
}

export default async function Home() {
  // var data: ok = {tables: ["waiting"]}
  // await axios.get(`http://${process.env.API_HOST}:${process.env.API_PORT}/api/db/tables`)
  //   .then(res => {
  //     data = res.data
  //     console.log(data)
  //   })
  //   .catch(err => console.log(err))

  return (
    <main>
      {/* {data.tables.map((table, key) => <p key={key}>{table}</p>)} */}
      <MyForm sendRequest={sendRequest}/>
    </main>
  )
}
