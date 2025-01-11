'use client'
import useSidebarStore from '@/storage/countSidebar'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const SidebarDataProvider = ({ children }: { children: React.ReactNode }) => {
	const session = useSession()
	const { loadItemsFromBackend, itemLengths } = useSidebarStore()
	useEffect(() => {
		if (session.status === 'authenticated')
			loadItemsFromBackend(
				session.data.user.id,
				session.data.tokens.accessToken
			)
	}, [session])

	return <>{children}</>
}

export default SidebarDataProvider
