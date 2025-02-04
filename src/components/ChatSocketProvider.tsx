'use client'

import { getChats } from '@/api/chat'
import { useChatStore } from '@/storage/chatStore'
import { useEffect } from 'react'

const ChatSocketProvider = ({
	userId,
	children,
}: {
	userId: string
	children: React.ReactNode
}) => {
	const { initializeSocket, setChats, joinChatRooms } = useChatStore()

	useEffect(() => {
		initializeSocket(userId)
		loadChats()
	}, [])

	const loadChats = async () => {
		const chats = await getChats(userId)
		setChats(chats)
		joinChatRooms(chats)
	}

	return <>{children}</>
}

export default ChatSocketProvider
