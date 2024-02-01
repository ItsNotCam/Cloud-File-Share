import Link from 'next/link'
import { authenticate } from '@/lib/db/util'
import { redirect } from 'next/navigation'
import DBFiles from '@/lib/db/DBFiles'
import FileTable from './_components/file-table'
import UploadForm from './_components/upload-form'

export default async function Home(): Promise<JSX.Element> {
	const user = await authenticate()
	if (user === undefined) {
		redirect("/login")
	}

	const { ID, USERNAME } = user
	const files = await DBFiles.GetFilesOfUser({USER_ID: ID})

	return (
		<div className="table-container">
			<p>
				<strong style={{ color: "white" }}>Username:</strong> {user.USERNAME}
				<br />
				<strong style={{ color: "white" }}>User ID:</strong> {user.ID}
			</p>
			<UploadForm />
			{files.length > 0 ? (
				<FileTable files={files} />
			) : (
				<h1 style={{fontSize: "1.3rem"}}>You don't have any files yet 😊</h1>
			)}
			<Link href="/logout"><span className="logout-button">Logout</span></Link>
		</div>
	)
}