import Header from './header';
import './styles.css'

import WithAuth from "@/lib/with-auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<WithAuth>
			<Header />
			{children}
		</WithAuth>
	)
}