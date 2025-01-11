import SocketApi from '@/api/socketApi'
import { useEffect } from 'react'

export const useConnectSocket = (userId: string) => {
	const connectSocket = () => {
		if (!userId) return
		SocketApi.createConnection(userId)
	}

	useEffect(() => {
		connectSocket()
		return () => {
			SocketApi.disconnect() // Отключаем при размонтировании
		}
	}, [userId]) // Переподключаемся при изменении userId
}
