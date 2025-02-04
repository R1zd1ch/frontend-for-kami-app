import { useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'

export const useChatSocket = (userId: string) => {
	const socket = useMemo(
		() =>
			io('http://localhost:3005', {
				query: { userId },
				extraHeaders: {
					userId,
				},
			}),
		[userId]
	)

	useEffect(() => {
		return () => {
			socket.disconnect()
		}
	}, [socket])

	return socket
}
