import ChatSocketProvider from '@/components/ChatSocketProvider'
import SidebarChats from '@/components/messages/SidebarChats'
import getSession from '@/lib/getSession'

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const session = await getSession()

	return (
		<ChatSocketProvider userId={session?.user.id}>
			<div className='w-full h-[98vh] flex flex-row gap-4 '>
				<SidebarChats userId={session?.user.id}></SidebarChats>
				{children}
			</div>
		</ChatSocketProvider>
	)
}

export default Layout
