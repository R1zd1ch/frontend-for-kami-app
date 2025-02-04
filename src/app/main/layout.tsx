import type { Metadata } from 'next'
import '../globals.css'
import Sidebar from '@/components/navigation/sidebar'
import MobileNav from '@/components/navigation/mobile-nav'
import AppBar from '@/components/AppBar'
import SocketProvider from '@/components/SocketProvider'
import getSession from '@/lib/getSession'
import { Suspense } from 'react'
import SidebarDataProvider from '@/components/SidebarDataProvider'
import { CookiesProvider } from 'next-client-cookies/server'
import { UserProfile } from '@/lib/types'

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await getSession()
	// console.log(session)

	const { username, email, avatarUrl, id } = session?.user || {
		username: '',
		email: '',
		image: '',
		id: '',
		tokens: {
			accessToken: '',
			refreshToken: '',
		},
	}

	return (
		<CookiesProvider>
			<Suspense fallback={<div>Loading...</div>}>
				<SidebarDataProvider session={session as UserProfile}>
					{/* <TokenRefresher></TokenRefresher> */}
					<SocketProvider userId={id}>
						<div className='grid min-h-screen max-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
							<Sidebar
								user={{
									username,
									email,
									avatar: avatarUrl || '',
									id: id || '',
								}}
							/>
							<div className='min-w-screen min-h-screen overflow-x-hidden'>
								<AppBar></AppBar>
								<MobileNav
									user={{
										username,
										email,
										avatar: avatarUrl || '',
										id: id || '',
									}}
								/>
								<div className='p-2'>{children}</div>
							</div>
						</div>
					</SocketProvider>
				</SidebarDataProvider>
			</Suspense>
		</CookiesProvider>
	)
}
