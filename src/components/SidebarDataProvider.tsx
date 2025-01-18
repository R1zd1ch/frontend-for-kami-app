'use client'
import useSidebarStore from '@/storage/countSidebar'
import { useEffect } from 'react'
import { UserProfile } from '@/lib/types'

const SidebarDataProvider = ({
	children,
	session,
}: {
	children: React.ReactNode
	session: UserProfile
}) => {
	const { loadItemsFromBackend } = useSidebarStore()

	useEffect(() => {
		console.log(session, 'HOHOHO')
		if (session) loadItemsFromBackend(session.user.id)
	}, [session])

	return <>{children}</>
}

export default SidebarDataProvider
